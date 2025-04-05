const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const router = express.Router();
const User = require('./models/user');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcryptjs = require('bcryptjs');
const MongoStore = require('connect-mongo');
const isAuthenticated = require('./middleware/auth');

// Charger les variables d'environnement

dotenv.config();


// Créer une application Express
const app = express();
app.use(cookieParser());
// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

const cors = require('cors');
app.use(cors());


const sessionMiddleware = session({
    secret: process.env.JWT_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: 'myDay', // Nom de la base de données
        collectionName: 'production', // Nom de la collection pour les sessions
    }),
    cookie: {
        secure: false, // Mettre true en production avec HTTPS
        maxAge: 30*24 * 60 * 60 * 1000, // Durée de vie des cookies (30 jour ici)
    },
});

app.use(sessionMiddleware);

app.use(session({
  secret: 'myDay',
  resave: false,
  saveUninitialized: false
}))

// app.use((req, res, next) => {
//   const isLoggedIn = req.session.user;

//   // Si la requête est pour login ou register, on laisse passer
//   if (req.path === '/Login' || req.path === '/Register' || req.path === '/login' || req.path === '/Register') {
//     return next();
//   }

//   // Si l'utilisateur est connecté, on continue
//   if (isLoggedIn) {
//     return next();
//   }

//   // Sinon on redirige vers /Login
//   return res.redirect('/Login');
// });

// Ne protège que les API sensibles, pas les routes de React
app.use('/api', (req, res, next) => {
  const isLoggedIn = req.session.user;
  if (!isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  next();
});



const connectDB = require('./config/db');
connectDB();
// Serveur des fichiers statiques de React
if (process.env.NODE_ENV === 'production') {
    // Sert les fichiers statiques du build React
    app.use(express.static(path.join(__dirname, '..', 'front-end', 'build')));
  
    // Toutes les autres routes renvoient le fichier index.html de React
   
    // app.get('/', (req, res) => {
    //   if (!req.session.user) {
    //     console.log("Utilisateur non connecté, redirection vers /login");
    //     return res.redirect('/login');
    //   } else {
    //     console.log("Utilisateur connecté :", req.session.user);
    //     res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
    //   }
    // });

    // app.get('/', (req, res) => {
    //   return res.redirect('/Login');
    // })

    app.get('/', isAuthenticated, (req, res) => {
      res.render('index', { user: req.session.user });
    });
    
    app.get('/Login', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
        console.log("dans /Login")
    });

    // app.post('/login', async (req, res) => {
    //     const { pseudo, password } = req.body;
    //     console.log("pseudo : ",pseudo)
    //     console.log("psw : ",password)
    //     try {
    //       const userLogged = await User.findOne({ pseudo });
    
    //         // Vérifier si l'utilisateur existe
    //         if (!userLogged) {
    //             return res.render('login', { message: "Login ou mot de passe erroné !" });
    //         }
    
    //         // Vérifier si le mot de passe correspond au hash stocké
    //         const isMatch = await bcryptjs.compare(password, userLogged.password);
    //         if (!isMatch) {
    //           return res.status(400).json({ message: "Login ou mot de passe erroné !" });
    //         }
    
    //         // Création de la session utilisateur après authentification réussie
    //         req.session.user = {
    //             _id: userLogged._id,
    //             username: userLogged.pseudo,
    //         };

    //         console.log("Session après connexion :", req.session);
    
    //         // Redirection selon le rôle de l'utilisateur
    //         if (userLogged.isAdmin === "y") {
    //             console.log("Utilisateur admin connecté");
    //             return res.redirect('/admin');
    //         } else {
    //             console.log("Utilisateur connecté :", req.session.user.username);
    //             return res.json({ success: true, redirectUrl: '/' });
    //         }
    //     } catch (err) {
    //         console.error("Erreur lors de la connexion :", err);
    //         res.status(500).send("Erreur lors de la connexion");
    //     }
    // });

    app.post('/login', async (req, res) => {
      const { pseudo, password } = req.body;
      console.log("pseudo : ", pseudo);
      console.log("psw : ", password);
  
      try {
          const userLogged = await User.findOne({ pseudo });
  
          // Vérifier si l'utilisateur existe
          if (!userLogged) {
              return res.render('login', { message: "Login ou mot de passe erroné !" });
          }
  
          // Vérifier le mot de passe
          const isMatch = await bcryptjs.compare(password, userLogged.password);
          if (!isMatch) {
              return res.render('login', { message: "Login ou mot de passe erroné !" });
          }
  
          // Créer la session utilisateur
          req.session.user = {
              _id: userLogged._id,
              username: userLogged.pseudo,
          };
  
          console.log("Session après connexion :", req.session);
  
          // Redirection
          if (userLogged.isAdmin === "y") {
              console.log("Utilisateur admin connecté");
              return res.redirect('/admin');
          } else {
              console.log("Utilisateur connecté :", req.session.user.username);
              return res.json({ success: true, redirectUrl: '/' });
          }
  
      } catch (err) {
          console.error("Erreur lors de la connexion :", err);
          res.status(500).send("Erreur lors de la connexion");
      }
  });

    app.get('/api/check-auth', (req, res) => {
      if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
      } else {
        res.json({ authenticated: false });
      }
    });
  
    app.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
    console.log("dans /Register")
    });

    app.post('/Register', async (req, res) => {
        // console.log("Requête reçue sur /Register");
        console.log("Données reçues :", req.body); 
        const { pseudo, password, feelings } = req.body;
        // Vérification du mot de passe
        // if (!passwordClean || passwordClean.trim() === '') {
        //   return res.status(400).json({ message: 'Mot de passe requis' });
        // }
      // passwordClean
        const passwordHashed = await bcryptjs.hash(password, 10);
        const newUser = new User({
            pseudo,
            password:passwordHashed,
            feelings,
        });

          // Hacher le mot de passe après validation
           

        try {
            // Enregistrement dans la base de données
            await newUser.save();
            console.log('Utilisateur enregistré avec succès !');
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err);
            res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
        }
    });

    app.post('/', (req, res) => {
        const { feeling1, feeling2, feeling3, feeling4, phraseGratitude, regle } = req.body;
    
        console.log("Données reçues du client :");
        console.log("Joie :", feeling1);
        console.log("Stress :", feeling2);
        console.log("Colère :", feeling3);
        console.log("Légèreté :", feeling4);
        console.log("Phrase de gratitude :", phraseGratitude);
        console.log("Règle acceptée :", regle);
    
        res.json({ message: "Données bien reçues par le serveur" });
    });

    

  } else {
    // En développement, tu peux laisser React gérer le routage via son serveur de développement
    app.get('/', (req, res) => {
      res.send('API backend en cours d\'exécution');
    });
  }

// Lancer le serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// module.exports = router;

