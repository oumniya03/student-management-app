# 🎓 Student Management System

Application Full Stack de gestion des étudiants avec importation/exportation XML, conteneurisée avec Docker.


## 🎯 Aperçu du Projet

Cette application permet la gestion complète des données d'étudiants avec les capacités suivantes :
- Import de données depuis des fichiers XML validés par XSD
- Opérations CRUD (Créer, Lire, Modifier, Supprimer)
- Export des données en format XML
- Authentification sécurisée avec JWT
- Interface utilisateur moderne et responsive
- Déploiement conteneurisé avec Docker

## ✨ Fonctionnalités

- **Gestion CRUD complète** : Créer, lire, modifier et supprimer des étudiants
- **Import/Export XML** : Importer des données depuis XML et exporter vers XML
- **Validation XSD** : Validation des fichiers XML via schéma XSD
- **Authentification JWT** : Sécurisation des endpoints API
- **Auto-incrémentation d'ID** : Gestion intelligente des IDs séquentiels
- **Interface responsive** : Accessible depuis desktop et mobile
- **Conteneurisation** : Déploiement facile avec Docker Compose

## 🏗️ Architecture

L'application suit une **architecture à trois tiers** :

```
┌─────────────────┐
│   Frontend      │  React + Nginx
│   (Port 3000)   │
└────────┬────────┘
         │
┌────────▼────────┐
│   Backend       │  Node.js + Express
│   (Port 5000)   │  + JWT
└────────┬────────┘
         │
┌────────▼────────┐
│   Database      │  MongoDB
│   (Port 27017)  │
└─────────────────┘
```

### Services Docker

- **students_frontend** : Application React servie par Nginx
- **students_backend** : API REST Node.js/Express
- **students_db** : Base de données MongoDB

## 🛠️ Technologies Utilisées

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Frontend** | React + Vite | Interface utilisateur dynamique |
| **Backend** | Node.js + Express | API REST et logique métier |
| **Base de données** | MongoDB | Stockage NoSQL des documents |
| **Authentification** | JWT | Sécurisation des endpoints |
| **Parsing XML** | xml2js | Conversion XML ↔ JSON |
| **Auto-increment** | mongoose-sequence | Gestion des IDs séquentiels |
| **Conteneurisation** | Docker + Docker Compose | Déploiement isolé |
| **Serveur web** | Nginx | Service des fichiers statiques React |

## 🚀 Installation et Démarrage

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé
- WSL 2 activé (pour Windows)
- Git installé

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/oumniya03/Projet_competition.git
cd student-app
```

2. **Lancer l'application avec Docker Compose**
```bash
docker-compose up --build
```

3. **Accéder à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000
- MongoDB : localhost:27017

### Accès depuis mobile

Pour accéder depuis un téléphone sur le même réseau :
```
http://<VOTRE_IP>:3000
```
Changer l'adresse IP depuis le  "config.js"


## 📱 Utilisation

### 1. Authentification
- Accédez à http://localhost:3000
- Cliquez sur "Se connecter"
- Les credentials par défaut sont configurés dans le backend

### 2. Import de données XML
- Naviguez vers "Importation XML"
- Sélectionnez votre fichier `liste.xml`
- Cliquez sur "Envoyer"
- Les données sont validées, converties et stockées dans MongoDB

### 3. Gestion des étudiants
- **Affichage** : Liste automatique de tous les étudiants
- **Ajout** : Formulaire pour ajouter un nouvel étudiant
- **Modification** : Cliquez sur "Modifier" pour éditer
- **Suppression** : Cliquez sur "Supprimer" pour retirer un étudiant

### 4. Export XML
- Cliquez sur "Exporter XML"
- Le fichier XML est généré et téléchargé automatiquement

## 📁 Structure du Projet

```
student-app/
├── backend/                    # API Node.js
│   ├── models/                # Modèles Mongoose
│   ├── routes/                # Routes Express
│   ├── middleware/            # JWT & validation
│   ├── services/              # Logique métier
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/       # Composants React
│   │   ├── App.jsx           # Composant principal
│   │   └── main.jsx
        └── config.js         # Fichier de configuration centralisé
│   ├── Dockerfile
│   └── package.json
│
├── data/                       # Fichiers XML/XSD
│   ├── students.xsd          # Schéma de validation
│   └── liste.xml             # Exemple de données
│
└── docker-compose.yml         # Orchestration des services
```

## 🔌 API Endpoints

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/login` | Authentification et génération JWT | Non |
| GET | `/students` | Récupérer tous les étudiants | Oui |
| POST | `/students` | Créer un nouvel étudiant | Oui |
| PUT | `/students/:id` | Modifier un étudiant | Oui |
| DELETE | `/students/:id` | Supprimer un étudiant | Oui |
| POST | `/upload-xml` | Importer un fichier XML | Oui |
| GET | `/export-xml` | Exporter les données en XML | Oui |

### Exemple d'utilisation avec JWT

```bash
# 1. Se connecter et obtenir le token
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# 2. Utiliser le token pour accéder aux ressources
curl -X GET http://localhost:5000/students \
  -H "Authorization: Bearer <votre_token_jwt>"
```

## 🔧 Configuration

### Variables d'environnement Backend

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/studentsdb
JWT_SECRET=votre_secret_key
```

### Format XML attendu

```xml
<?xml version="1.0" encoding="UTF-8"?>
<students>
  <student>
    <nom>Dupont</nom>
    <prenom>Jean</prenom>
    <filiere>Informatique</filiere>
    <age>22</age>
    <email>jean.dupont@example.com</email>
  </student>
</students>
```

## 🐛 Résolution des problèmes

### Docker ne démarre pas
- Vérifiez que WSL 2 est installé : `wsl --list --verbose`
- Vérifiez que la virtualisation est activée dans le BIOS
- Redémarrez Docker Desktop

### Erreur "Token invalide"
- Reconnectez-vous via l'interface de connexion
- Vérifiez que le token est bien inclus dans l'en-tête Authorization

### Les conteneurs ne communiquent pas
- Vérifiez que tous les services sont sur le même réseau Docker
- Utilisez les noms de services Docker (ex: `mongo`, `students_backend`) au lieu de `localhost`

## 👤 Author

**Oumniya Moutaouakil**
- Master's Student in Advanced Machine Learning & Multimedia Intelligence.
- GitHub: [@oumniya03](https://github.com/oumniya03)
- Project: [student-management-app](https://github.com/oumniya03/student-management-app.git)

## 🔗 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation React](https://react.dev/)
- [Documentation Express](https://expressjs.com/)
- [Documentation MongoDB](https://www.mongodb.com/docs/)
- [JWT Introduction](https://jwt.io/introduction/)
