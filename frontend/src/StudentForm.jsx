import React, { useState, useEffect } from 'react';
import axios from 'axios';

//const API_URL = 'http://100.103.127.62:5000'; 
import { API_URL } from './config';
const StudentForm = ({ currentStudent, setStudents, token, closeModal }) => {
    // Tous les champs sont inclus ici
    const initialState = { nom: '', prenom: '', filiere: '', age: '', email: '' }; 
    const [formData, setFormData] = useState(initialState);
    
    useEffect(() => {
        if (currentStudent) {
            setFormData({
                nom: currentStudent.nom || '',
                prenom: currentStudent.prenom || '',
                filiere: currentStudent.filiere || '',
                age: currentStudent.age || '',
                email: currentStudent.email || '',
            });
        } else {
            setFormData(initialState);
        }
    }, [currentStudent]);

    const handleChange = (e) => {
        // Gérer les nombres pour l'âge
        const value = e.target.name === 'age' ? parseInt(e.target.value) || '' : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentStudent && currentStudent._id) {
                // Modification (PUT)
                await axios.put(`${API_URL}/students/${currentStudent._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Création (POST)
                await axios.post(`${API_URL}/students`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            closeModal();
        } catch (error) {
            console.error("Erreur CRUD:", error);
            alert(`Échec de l'opération: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: '#383c4a', borderRadius: '8px' }}>
            <h3 style={{color: '#fff'}}>{currentStudent ? "Modifier l'étudiant" : "Ajouter un étudiant"}</h3>
            <p><input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required /></p>
            <p><input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required /></p>
            <p><input type="text" name="filiere" value={formData.filiere} onChange={handleChange} placeholder="Filière" required /></p>
            <p><input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Âge" min="16" max="99" required /></p>
            <p><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required /></p>
            
            <button type="submit">{currentStudent ? "Sauvegarder les modifications" : "Ajouter"}</button>
            <button type="button" onClick={closeModal} style={{backgroundColor: '#ff5555'}}>Annuler</button>
        </form>
    );
};

export default StudentForm;