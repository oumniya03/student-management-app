import React from 'react';

const sidebarStyles = {
    width: '240px',
    minHeight: '100%',
    backgroundColor: '#242D38', /* Un peu plus sombre que le conteneur principal */
    padding: '30px 20px',
    boxShadow: '4px 0 8px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid #4A5568',
};

const navItemStyles = {
    width: '100%',
    padding: '15px 20px',
    margin: '10px 0',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease-in-out',
    fontWeight: '500',
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
};

const activeStyles = {
    ...navItemStyles,
    backgroundColor: '#4FD1C5',
    color: '#1A202C',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
};

const defaultStyles = {
    ...navItemStyles,
    backgroundColor: '#383c4a',
    color: '#EDF2F7',
};

const Sidebar = ({ currentView, setView }) => {
    return (
        <div style={sidebarStyles}>
            <h2 style={{ color: '#4FD1C5', marginBottom: '35px', padding: 0, borderLeft: 'none' }}>MENU</h2>
            
            <div 
                style={currentView === 'crud' ? activeStyles : defaultStyles} 
                onClick={() => setView('crud')}
            >
                <i className="fas fa-users"></i> Gestion (CRUD)
            </div>
            
            <div 
                style={currentView === 'import' ? activeStyles : defaultStyles} 
                onClick={() => setView('import')}
            >
                <i className="fas fa-file-import"></i> Importation XML
            </div>
            
        </div>
    );
};

export default Sidebar;