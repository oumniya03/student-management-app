import React from 'react';

const StudentTable = ({ students, handleDelete, handleEdit }) => {
    return (
        <table className="student-table">
            <thead>
                <tr>
                    <th style={{ width: '5%' }}>ID</th>
                    <th style={{ width: '15%' }}>Nom</th>
                    <th style={{ width: '15%' }}>Prénom</th>
                    <th style={{ width: '20%' }}>Filière</th>
                    <th style={{ width: '5%' }}>Âge</th>
                    <th style={{ width: '20%' }}>Email</th>
                    <th style={{ width: '20%', textAlign: 'center' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.length === 0 ? (
                    <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                            Aucun étudiant trouvé. Utilisez l'Importation XML ou le bouton Ajouter.
                        </td>
                    </tr>
                ) : (
                    students.map((s) => (
                        <tr key={s._id}>
                            <td style={{ fontWeight: 'bold', color: '#BEE3F8' }}>{s.id}</td>
                            <td>{s.nom}</td>
                            <td>{s.prenom || 'N/A'}</td>
                            <td>{s.filiere}</td>
                            <td>{s.age || 'N/A'}</td>
                            <td style={{ fontSize: '0.85em', color: '#9AE6B4' }}>{s.email}</td>
                            <td className="action-buttons" style={{ textAlign: 'center' }}>
                                {/* Utilise s._id pour l'action DELETE/PUT car c'est l'ID de MongoDB */}
                                <button onClick={() => handleEdit(s)} style={{ backgroundColor: '#F6AD55', color: '#1A202C' }}>
                                    Modifier
                                </button>
                                <button onClick={() => handleDelete(s._id)} style={{ backgroundColor: '#FC8181' }}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default StudentTable;