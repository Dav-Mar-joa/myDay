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
const {encrypt, decrypt, hashed} = require('./utils/cryptOutils')

dotenv.config();

const app = express();
app.use(cookieParser());

;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require('cors');

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3030', // frontend URL
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1)

const sessionMiddleware = session({
    secret: process.env.JWT_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        
      httpOnly: true,
      sameSite: 'lax'   
    },
});

app.use(sessionMiddleware);

app.use('/api', (req, res, next) => {
  const isLoggedIn = req.session.user;
  if (!isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
  next();
});

const connectDB = require('./config/db');
connectDB();

if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '..', 'front-end', 'build')));

  app.get('/', isAuthenticated, (req, res) => {
    const theme = req.session.user?.theme || 'colorful';
    console.log("dans home ->>>>>> :",theme)
    res.render('index', { user: req.session.user, theme });
  });

  app.post('/', async (req, res) => {
    const { feeling1, feeling2, feeling3, feeling4, phraseGratitude, regle } = req.body;
    const feeling1Encrypted = feeling1 ? encrypt(feeling1) : "";
    const feeling2Encrypted = feeling2 ? encrypt(feeling2) : "";
    const feeling3Encrypted = feeling3 ? encrypt(feeling3) : "";
    const feeling4Encrypted = feeling4 ? encrypt(feeling4) : "";
    const regleEncrypted = regle ? encrypt(regle) : "";
    const theme = req.session.user?.theme || 'colorful';

    if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }
    const phraseGratitudeEncrypted = phraseGratitude ? encrypt(phraseGratitude) : "";

    try {
        // Cherche l'utilisateur connecté
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = new Date().toLocaleString("sv-SE", { timeZone: timezone }); // format ISO-like

        // Convertir en vrai objet Date
        const userLocalDate = new Date(localDate);
        // Ajoute la réponse au tableau `responses`
        console.log("je suis avant insert MongoDB")
        user.responses.push({
            feeling1:feeling1Encrypted,
            // feeling1,
            feeling2:feeling2Encrypted,
            feeling3:feeling3Encrypted,
            feeling4:feeling4Encrypted,
            phraseGratitude: phraseGratitudeEncrypted || "",
            regle:regleEncrypted,
            // regle,
            timezone: timezone,
            userLocalDate: userLocalDate.toISOString() // envoyer une date valide

        });

        // console.log("user.responses",user.responses)

        // Sauvegarde dans la DB
        await user.save();

        // console.log("Réponse enregistrée pour l'utilisateur :", user.pseudo);

        res.json({ message: "Réponse enregistrée avec succès" });
    } catch (err) {
        console.error("Erreur lors de l'enregistrement de la réponse :", err);
        res.status(500).json({ message: "Erreur serveur lors de l'enregistrement" });
    }
  });
  
  app.get('/Login', async (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  });

  app.post('/Login', async (req, res) => {
    const { pseudo, password } = req.body;
    try {
        const userLogged = await User.findOne({ pseudo });

        if (!userLogged) {
          return res.status(400).json({ errorMessage: "Login ou mot de passe erroné !" });
        }

        const isMatch = await bcryptjs.compare(password, userLogged.password);
        if (!isMatch) {
            return res.status(400).json({ errorMessage: "Login ou mot de passe erroné !" });
        }

        // Créer la session utilisateur
        req.session.user = {
            _id: userLogged._id,
            username: userLogged.pseudo,
        };

        // Redirection
        if (userLogged.isAdmin === "y") {
            console.log("Utilisateur admin connecté");
            return res.redirect('/admin');
        } else {
            return res.json({ success: true, redirectUrl: '/' });

        }

    } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        res.status(500).send("Erreur lors de la connexion");
    }
  });

  app.get('/api/check-auth', async (req, res) => {
    if (req.session.user) {
      const pseudo = req.session.user.username
      try {
      const user= await User.findOne({ pseudo: pseudo })
      return res.json({ authenticated: true, user: req.session.user,theme:user.theme });
      } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        res.status(500).send("Erreur lors de la connexion");
      }
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });

  app.get('/Register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  console.log("dans /Register")
  });

  app.post('/Register', async (req, res) => {
    const { pseudo, password, feelings,mail,phraseRegister } = req.body;
    const theme= req.body.theme || "colorful";
    const feeling1Encrypted = []
    feeling1Encrypted[0] = feelings[0] ? encrypt(feelings[0]) : "";
    feeling1Encrypted[1] = feelings[1] ? encrypt(feelings[1]) : "";
    feeling1Encrypted[2] = feelings[2] ? encrypt(feelings[2]) : "";
    feeling1Encrypted[3] = feelings[3] ? encrypt(feelings[3]) : "";
    const mailHashed = mail ? hashed(mail) : "";
    const mailHash=encrypt(mail)
    phraseRegisterEncrypted= phraseRegister ? encrypt(phraseRegister) :"";
    const passwordHashed = await bcryptjs.hash(password, 10);
    const pseudoExist = await User.findOne({pseudo})
    const mailExist = await User.findOne({mail:mailHashed})

    if(pseudoExist){
      return res.status(409).json({ success: false, message: 'Pseudo déjà utilisé' });
    }
    else if (mailExist){
      return res.status(409).json({ success: false, message: 'Email déjà utilisé' });
    }
      else
    {
      const newUser = new User({
          pseudo,
          password:passwordHashed,
          feelings:feeling1Encrypted,
          mail:mailHashed,
          // mail:mail,
          mailHash:mailHash,
          theme:theme || 'colorful',
          phraseRegister:phraseRegisterEncrypted
      });
    console.log("new user :",newUser)
    try {
        // Enregistrement dans la base de données
        await newUser.save();
        console.log('Utilisateur enregistré avec succès !');
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
    }
    }  
  });

  app.get('/Historique', (req, res) => {
    if(req.session.user)
      res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
    console.log("dans /Emotions")
  });

  app.get('/Emotions', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  });

  app.get('/EmotionsSettings', (req, res) => {
      if(req.session.user)
        res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  });

  app.get('/DelUser', (req, res) => {
    if(req.session.user)
      res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  });

  app.post('/DelUser', async (req, res) => {
    const userDel = req.session.user;

    try {
      const user = await User.findOne({ pseudo: userDel.username});
      console.log("user dans del : ",user)
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      await User.deleteOne({ pseudo: userDel.username });
      console.log('Utilisateur supprimé avec succès !');
      res.status(201).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', err);
      res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
  })
 
  app.get('/Identifiants', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  }); 

  app.get('/IdentifiantsMdp', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  }); 

  app.post('/IdentifiantsMdp', async (req, res) => {
    const { pseudo, phraseRegister, newPassword } = req.body;
    try {
        const user = await User.findOne({ pseudo });
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const decryptedPhrase = decrypt(user.phraseRegister); // Décryptage de la phrase enregistrée
        if (decryptedPhrase !== phraseRegister) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }
        console.log("nouveaupassword : ",newPassword)
        // Hashage du nouveau mot de passe
        const passwordHashed = await bcryptjs.hash(newPassword, 10);

        // Mise à jour du mot de passe dans la base de données
        user.password = passwordHashed;
        await user.save();

        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  });

  app.get('/IdentifiantsPseudo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  }); 

  app.post("/IdentifiantsPseudo", async (req,res)=>{
    console.log("dans recuperation du login")
    const {mail,password}=req.body
    const mailHashed=mail ? hashed(mail):""
    try {
      const user = await User.findOne({mail:mailHashed});
      const isMatch = await bcryptjs.compare(password, user.password);
      if(isMatch){
        res.json({ success: true, pseudo: user.pseudo });
      }
    }
    catch (err) {
      console.error(err);
      res.json({ success: false });
  } 
  })

  app.post('/setTheme', async (req, res) => {
    const { pseudo, theme } = req.body;
    console.log("dans /set theme")
    if (!pseudo || !theme) {
        return res.status(400).json({ success: false, message: "Pseudo ou thème manquant" });
    }

    try {
        const result = await User.updateOne(
            { pseudo },
            { $set: { theme } },
        );

        if (result.modifiedCount === 1) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "Utilisateur non trouvé ou pas modifié" });
        }
    } catch (err) {
        console.error("Erreur dans /setTheme :", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  });

  app.post('/getTheme', async (req, res) => {
    console.log("dans /get theme")
    const { pseudo } = req.body;
    try {
      const user = await User.findOne({pseudo});
        if (user && user.theme) {
            res.json({ success: true, theme: user.theme });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error("Erreur lors de la récupération du thème :", err);
        res.json({ success: false, message: "Erreur serveur" });
    }
  });

  app.get('/Settings', (req, res) => {
    const pseudo = req.session.user.username
    console.log("pseudo 23: ",pseudo)
    res.sendFile(path.join(__dirname, '..', 'front-end', 'build', 'index.html'));
  }); 

  app.post('/Settings', (req, res) => {
    const pseudo = req.session.user.username;
    console.log("Pseudo : ", pseudo);

    if (!pseudo) {
        return res.status(400).json({ success: false, message: "Utilisateur non connecté" });
    }

  // Récupérer le thème pour cet utilisateur
    const theme = getUserTheme(pseudo); // Utiliser une fonction qui récupère le thème en fonction du pseudo

    res.json({
        success: true,
        pseudo: pseudo,
        theme: theme,
    });
  });

  app.get('/user-feelings', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
      const user = await User.findById(req.session.user._id);
      if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      const theme = user.theme;
      const regles = user.responses.map(response => decrypt(response.regle));
      const decryptedFeelings = user.feelings.map(feeling => decrypt(feeling));
      res.json({ feelings: decryptedFeelings,phrasesGratitude:user.responses,regles,theme});
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des émotions' });
    }
  });

  app.get('/user-phraseGratitude', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const sortedResponses = user.responses.sort((a, b) => new Date(b.userLocalDate) - new Date(a.userLocalDate));

      const phrases = sortedResponses.map(r => ({
        phraseGratitude: r.phraseGratitude,
        date: r.userLocalDate
      }))

      res.json({ phrases });
    } catch (err) {
      console.error("Erreur lors de la récupération :", err);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des phrases' });
    }
  });

  app.post('/logout', (req, res) => {
    if (req.session.user) {
        console.log("// Détruire la session actuelle !!! ")
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
            }
            res.clearCookie('connect.sid', { path: '/' }); 
            res.status(200).json({ message: 'Déconnexion réussie' });
        });
    } else {
        res.status(400).json({ message: 'Aucun utilisateur connecté' });
    }
  });

  app.get('/user-regles', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

          const decryptedResponses = user.responses.map(response => {
          const decryptedRegle = decrypt(response.regle);
          const responseObj = response.toObject ? response.toObject() : response;
    
          return {
            ...responseObj, 
            regle:decryptedRegle
    
          };
        });

        res.json(decryptedResponses);

    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des règles' });
    }
  });

  app.get('/getFeelings', async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'non autorisé' });
      }

      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const feelingsDecrypted = user.feelings.map(f => f ? decrypt(f) : "");

      res.json({ feelings: feelingsDecrypted,pseudo:user.pseudo });
    } catch (error) {
      console.error("Erreur dans /getFeelings :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post('/updateFeeling', async (req, res) => {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
  
      const { index, newFeeling } = req.body;
      const user = await User.findById(req.session.user._id);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      const indexFeelingChanged = index + 1;
      const feelingKey = 'feeling' + indexFeelingChanged;
  
      console.log("feelingKey : ", feelingKey);
  
      // Accéder dynamiquement aux propriétés de responses pour effacer l'historique uniquement du feeling modifié
      user.responses.forEach((response) => {
        response[feelingKey] = null;
      });

      if (newFeeling !== null && newFeeling !== undefined && newFeeling !== '' ) {
        const encryptedFeeling = encrypt(newFeeling);
        user.feelings[index] = encryptedFeeling;
      } else {
        // console.log('user.feeling[index] :',user.feelings[index])
        user.feelings[index] = encrypt("deleted"); // On met bien un vrai null
      }
  
      // Crypter le nouveau feeling
      const encryptedFeeling = encrypt(newFeeling);
  
      // Mettre à jour le feeling dans le tableau `feelings` de l'utilisateur
      user.feelings[index] = encryptedFeeling;
  
      // Sauvegarder l'utilisateur après modification
      await user.save();
  
      // Répondre avec succès
      res.status(200).json({ message: 'Feeling mis à jour et historique effacé avec succès' });
    } catch (err) {
      console.error("Erreur dans /updateFeeling :", err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  app.get('/user-history', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
      const user = await User.findById(req.session.user._id);
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const decryptedResponses = user.responses.map(response => {
        const decryptedPhraseGratitude = decrypt(response.phraseGratitude);
        const decryptedfeeling1 = decrypt(response.feeling1);
        const decryptedfeeling2 = decrypt(response.feeling2);
        const decryptedfeeling3 = decrypt(response.feeling3);
        const decryptedfeeling4 = decrypt(response.feeling4);
        const decryptedRegle = decrypt(response.regle);

        // Utiliser toObject pour nettoyer les données Mongoose avant de les renvoyer
        const responseObj = response.toObject ? response.toObject() : response;

        return {
          ...responseObj,
          phraseGratitude: decryptedPhraseGratitude,
          feeling1: decryptedfeeling1 ,
          feeling2: decryptedfeeling2 ,
          feeling3: decryptedfeeling3 ,
          feeling4: decryptedfeeling4,
          regle:decryptedRegle,
        };
      });

      // Renvoie les réponses avec la phraseGratitude décryptée
      res.json(decryptedResponses);
    } catch (err) {
      res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'historique' });
    }
  });

} else {
  app.get('/', (req, res) => {
    res.send('API backend en cours d\'exécution');
  });
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
