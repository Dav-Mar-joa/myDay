import { Router, Request, Response } from 'express';
import UserModel from '../model/User';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { pseudo, password } = req.body;
    try {
        const userLogged = await UserModel.findOne({ pseudo });
        if (!userLogged) {
            return res.status(400).json({ errorMessage: "Login ou mot de passe erroné !" });
        }

        const isMatch = password === userLogged.password;
        if (!isMatch) {
            return res.status(400).json({ errorMessage: "Login ou mot de passe erroné !" });
        }

        // Créer la session utilisateur
        req.session.user = {
            id: userLogged._id.toString(),
            username: userLogged.pseudo,
            feelings: userLogged.feelings
        };

        // Redirection
        if (userLogged.isAdmin === "y") { // TODO: Pourquoi ne pas mettre un boolean ici, au lieu d'un String ? 
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

router.get('/check-auth', async (req: Request, res: Response) => {
    if (req.session.user) {
        const pseudo = req.session.user.username
        try {
            const user = await UserModel.findOne({ pseudo: pseudo })
            if (user) {
                return res.status(200).json({ authenticated: true, user: req.session.user, theme: user.theme });
            }
            return res.status(403).json({ authenticated: false });
        } catch (err) {
            console.error("Erreur lors de la connexion :", err);
            res.status(500).send("Erreur lors de la connexion");
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

export default router;