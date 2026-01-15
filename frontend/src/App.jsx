import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';
import Sidebar from './Sidebar';

// L'URL de l'API (maintenue à localhost:5000 pour la compatibilité Host-Conteneur)
//const API_URL = 'http://localhost:5000'; 
//const API_URL = 'http://100.103.127.62:5000'; 

import { API_URL } from './config';
function App() {
  // 🚀 CHANGEMENT CRITIQUE : Initialise le token à null pour forcer la page de connexion
  const [token, setToken] = useState(null); 
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState('crud');

  // --- Initialisation et Logique de Démarrage ---
  
  // 1. Injecter Font Awesome et gérer la récupération du token
  useEffect(() => {
    // Injecter Font Awesome pour les icônes
    const link = document.createElement('link');
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Récupérer le token APRES l'initialisation de l'état
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        setToken(storedToken); // Met à jour l'état si un token existe
    }
    
  }, []);

  // 2. Logique pour charger les étudiants APRES que le token ait été mis à jour
  useEffect(() => {
    // Si on a un token et qu'on est sur la vue CRUD, on charge les étudiants.
    if (token && currentView === 'crud' && !showForm) {
      fetchStudents(true); 
    }
  }, [token, currentView, showForm]);


  // --- Fonctions API ---

  const login = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/login`, { username: 'admin' });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      fetchStudents(true); 
    } catch (err) {
      setError("Erreur de connexion : API non disponible ou erreur interne.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (isInitialLoad = false) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/students`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setStudents(res.data);

      // Logique pour basculer vers IMPORT si la DB est vide au démarrage
      if (isInitialLoad && res.data.length === 0) {
        setCurrentView('import');
      } else if (res.data.length > 0) {
        setCurrentView('crud');
      }
      
    } catch (err) { 
      // Si la requête échoue (token expiré), on vide le token pour forcer la reconnexion
      setToken(null);
      localStorage.removeItem('token');
      setError("Erreur de chargement des données. Veuillez vous reconnecter.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const uploadXML = async () => {
    if (!file) {
        setError("Veuillez sélectionner un fichier XML.");
        return;
    }
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axios.post(`${API_URL}/upload-xml`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      alert(`Succès : ${res.data.count} étudiants importés. La base de données a été vidée au préalable.`);
      
      setCurrentView('crud'); 
      fetchStudents(); 
    } catch (err) {
      setError(`Erreur d'importation: ${err.response?.data}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportXML = async () => {
    try {
      const response = await axios.get(`${API_URL}/export-xml`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'etudiants_export.xml');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'exportation XML.");
    }
  };
  
  // --- Fonctions CRUD (Callbacks) ---
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet étudiant ?")) {
        try {
            await axios.delete(`${API_URL}/students/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setStudents(students.filter(s => s._id !== id));
        } catch (error) { setError(error.message); }
    }
  };
  
  const handleEdit = (student) => { setEditingStudent(student); setShowForm(true); };
  const handleAdd = () => { setEditingStudent(null); setShowForm(true); };
  const closeModal = () => { setShowForm(false); setEditingStudent(null); fetchStudents(); };

  // --- Rendu JSX ---
  return (
    <div className="container">
      {/* Affichage du Titre */}
      <h1 style={{ textAlign: 'center', width: '100%', padding: '20px 0', backgroundColor: '#2D3748', borderBottom: '1px solid #4A5568' }}>
        Gestion des Étudiants 
      </h1>
      
      {/* Contenu principal de l'application */}
      <div className="app-layout">
        
        {/* 🚀 CORRECTION DE L'ERREUR D'AFFICHAGE : Afficher l'erreur UNIQUEMENT si l'utilisateur est connecté */}
        {error && token && <p className="error" style={{ width: '100%', margin: '20px auto', padding: '15px' }}>⚠️ {error}</p>}
        
        {!token ? (
          <div className="login-card">
            <i className="fas fa-lock" style={{ fontSize: '3rem', color: '#4FD1C5', marginBottom: '15px' }}></i>
            <h2>Authentification Requise</h2>
            <p style={{ color: '#A0AEC0' }}>Veuillez vous connecter pour accéder au tableau de bord.</p>
            <button onClick={login} style={{ marginTop: '15px' }}>
              {isLoading ? 'Connexion...' : 'Se connecter (Simulé)'}
            </button>
          </div>
        ) : (
          <>
            <Sidebar currentView={currentView} setView={setCurrentView} />

            <div className="main-content">
              {/* FORMULAIRE D'AJOUT/MODIFICATION */}
              {showForm && (
                  <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#383c4a', borderRadius: '10px' }}>
                      <StudentForm 
                          currentStudent={editingStudent} 
                          setStudents={setStudents} 
                          token={token} 
                          closeModal={closeModal} 
                      />
                  </div>
              )}

              {currentView === 'crud' && !showForm && (
                  <>
                      <h2>Liste des Étudiants</h2>
                      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                          <button onClick={handleAdd} style={{ backgroundColor: '#48BB78' }}>➕ Ajouter</button> {/* Vert */}
                          <button onClick={handleExportXML} style={{ backgroundColor: '#9F7AEA' }}>⬇️ Exporter XML</button> {/* Violet */}
                          <button onClick={() => fetchStudents()} disabled={isLoading} style={{ backgroundColor: '#2B6CB0' }}>
                              {isLoading ? 'Actualisation...' : 'Actualiser la Liste'}
                          </button>
                      </div>
                      <StudentTable 
                          students={students} 
                          handleDelete={handleDelete} 
                          handleEdit={handleEdit}
                      />
                  </>
              )}

              {currentView === 'import' && !showForm && (
                  <>
                      <h2>Importation XML</h2>
                      <div style={{ margin: '20px 0', border: '2px dashed #4A5568', padding: '25px', borderRadius: '10px', backgroundColor: '#242D38' }}>
                          <p style={{ color: '#BEE3F8' }}>1. Sélectionner votre fichier (Attention: L'importation remplace et réinitialise la liste).</p>
                          <input type="file" onChange={e => setFile(e.target.files[0])} style={{ marginRight: '15px' }}/>
                          <button onClick={uploadXML} disabled={!file} style={{ backgroundColor: '#4FD1C5' }}>Envoyer et Convertir</button>
                      </div>
                  </>
              )}
              
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;