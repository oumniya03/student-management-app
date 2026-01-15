const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); 
const fs = require('fs');
const xml2js = require('xml2js');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Importer le plugin d'auto-incrémentation
const AutoIncrement = require('mongoose-sequence')(mongoose);

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect('mongodb://mongo:27017/studentsDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error: ', err));

// --- Modèle Mongoose avec Auto-Incrémentation ---
const StudentSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // Notre ID incrémenté (1, 2, 3...)
    nom: String,
    prenom: String,
    filiere: String,
    age: Number,
    email: String
});

// Appliquer le plugin pour l'auto-incrémentation
StudentSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1 });
const Student = mongoose.model('Student', StudentSchema);

// --- Middleware d'Authentification JWT ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token requis");
    try {
        // La clé secrète doit être la même que celle utilisée dans app.post('/login')
        const decoded = jwt.verify(token.split(" ")[1], "SECRET_KEY"); 
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send("Token invalide");
    }
};

// --- Routes CRUD & Import/Export ---

// 1. Login (Simulé pour obtenir le JWT)
app.post('/login', (req, res) => {
    try {
        const token = jwt.sign({ user: 'admin' }, "SECRET_KEY", { expiresIn: '2h' });
        res.json({ token });
    } catch (e) {
        res.status(500).send("Erreur interne du serveur lors de la création du token.");
    }
});

// 2. Upload & Conversion XML -> MongoDB
const upload = multer({ dest: 'uploads/' });

app.post('/upload-xml', verifyToken, upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    
    fs.readFile(filePath, (err, data) => {
        if (err) return res.status(500).send("Erreur lecture fichier.");
        
        xml2js.parseString(data, async (err, result) => {
            if (err) return res.status(500).send("Erreur parsing XML");

            const studentsList = result.students.student; 
            
            const formattedData = studentsList.map(s => ({
                nom: s.nom[0],
                prenom: s.prenom ? s.prenom[0] : '',
                filiere: s.filiere[0],
                age: s.age ? parseInt(s.age[0]) : null,
                email: s.email[0],
            }));

            try {
                // 1. Vider la table des étudiants
                await Student.deleteMany({});
                
                // 2. Réinitialiser le compteur de séquences à 0 (pour que l'ID reparte de 1)
                try {
                   // Suppression de TOUS les compteurs pour être sûr de réinitialiser le nôtre
                   await mongoose.connection.db.collection('counters').deleteMany({});
                } catch (err) {
                   console.log("Erreur suppression compteur (mineur):", err);
                }
                
                let successCount = 0;
                
                // 3. Insérer UN PAR UN pour déclencher l'auto-incrémentation
                for (const studentData of formattedData) {
                    const newStudent = new Student(studentData);
                    await newStudent.save();
                    successCount++;
                }

                res.json({ message: "Données importées avec succès !", count: successCount });
            } catch (e) {
                res.status(500).send("Erreur sauvegarde DB: " + e.message);
            }
        });
    });
});

// 3. Récupérer les étudiants (Read)
app.get('/students', verifyToken, async (req, res) => {
    // Trier par ID auto-incrémenté pour l'affichage séquentiel
    const students = await Student.find().sort({ id: 1 }); 
    res.json(students);
});

// 4. Créer un nouvel étudiant (Create)
app.post('/students', verifyToken, async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (e) {
        res.status(500).send("Erreur lors de l'ajout de l'étudiant: " + e.message);
    }
});

// 5. Modifier un étudiant (Update)
app.put('/students/:id', verifyToken, async (req, res) => {
    try {
        // La modification se fait toujours sur l'ID MongoDB (_id)
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).send("Étudiant non trouvé.");
        res.json(updatedStudent);
    } catch (e) {
        res.status(500).send("Erreur lors de la modification de l'étudiant.");
    }
});

// 6. Supprimer un étudiant (Delete)
app.delete('/students/:id', verifyToken, async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).send("Étudiant non trouvé.");
        res.status(204).send();
    } catch (e) {
        res.status(500).send("Erreur lors de la suppression de l'étudiant.");
    }
});

// 7. Exporter les étudiants vers XML (Export)
app.get('/export-xml', verifyToken, async (req, res) => {
    try {
        const students = await Student.find().lean(); 

        // Préparer la structure XML
        const xmlStructure = {
            students: {
                student: students.map(s => ({
                    nom: s.nom,
                    prenom: s.prenom,
                    filiere: s.filiere,
                    age: s.age,
                    email: s.email
                }))
            }
        };

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(xmlStructure);

        res.header('Content-Type', 'application/xml');
        res.attachment('etudiants_export.xml');
        res.send(xml);

    } catch (e) {
        console.error(e);
        res.status(500).send("Erreur lors de l'exportation XML.");
    }
});

// Démarrer le serveur
app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));