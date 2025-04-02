const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
// const connectDB = require('./config/db'); // Si tu utilises MongoDB
// const userRoutes = require('./routes/userRoutes');
// const authMiddleware = require('./middlewares/authMiddleware');

// Charger les variables d'environnement
dotenv.config();

// Créer une application Express
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

const cors = require('cors');
app.use(cors());

// // Routes API (exemple)
// app.use('/api', userRoutes);

// // Connexion à la base de données MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connecté'))
//     .catch((error) => console.log(error));
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        process.exit(1);
    }
};

// Serveur des fichiers statiques de React
if (process.env.NODE_ENV === 'production') {
    // Sert les fichiers statiques du build React
    app.use(express.static(path.join(__dirname, '..', 'front-end', 'build')));
  
    // Toutes les autres routes renvoient le fichier index.html de React
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
      console.log("dans /")
    });
    app.get('/Login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
        console.log("dans /Login")
    });
    
    app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
    console.log("dans /Register")
    });

    // app.post('/Register', (req, res) => {
    //     console.log("Requête reçue sur /Register");
    //     console.log("Données reçues :", req.body); // 📌 Doit afficher les données envoyées
        
    //     const userPseudo = req.body.pseudo;
    //     const userPassword = req.body.password;
    //     const userFeeling = req.body.feelings;
    //     console.log('Pseudo reçu :', userPseudo);
    //     console.log('Password reçu :', userPassword);
    //     console.log('Felling 1 reçu :', userFeeling[0]);
    //     console.log('Felling 4 reçu :', userFeeling[3]);
    
    //     res.json({ message: "Données reçues", pseudo: userPseudo });
        
    // })
    app.post('/Register', (req, res) => {
        console.log("Requête reçue sur /Register");
        console.log("Données reçues :", req.body); 
    
        const userPseudo = req.body.pseudo;
        const userPassword = req.body.password || "non fourni";  // 🛠️ Évite l'erreur
        const feelings = req.body.feelings || []; // 🛠️ Évite undefined
    
        console.log('Pseudo reçu :', userPseudo);
        console.log('Password reçu :', userPassword);
    
        if (feelings.length > 0) {
            console.log('Felling 1 reçu :', feelings[0]);  
            console.log('Felling 4 reçu :', feelings[feelings.length - 1]);  
        } else {
            console.log('Aucun feeling reçu');
        }
    
        res.json({ message: "Données reçues", pseudo: userPseudo });
    });

  } else {
    // En développement, tu peux laisser React gérer le routage via son serveur de développement
    app.get('/', (req, res) => {
      res.send('API backend en cours d\'exécution');
    });
  }

// Routes
// app.use('/api', routes);

// // Middleware d'authentification (exemple)
// app.use(authMiddleware);

// Lancer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
