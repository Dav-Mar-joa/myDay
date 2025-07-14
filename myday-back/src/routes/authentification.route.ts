
import { Router, Request, Response } from 'express';
import UserModel from '../model/User';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
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
