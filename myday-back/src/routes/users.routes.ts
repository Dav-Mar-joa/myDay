import { Router, Request, Response } from 'express';
import UserModel from '../model/User';
import { IHistory, IRequestFeeling } from '@common/Model';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const router = Router();

router.get('/user-feelings', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
        const user = await UserModel.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        const theme = user.theme;
        const regles = user.responses.map(response => response.regle);

        res.json({ feelings: user.feelings, phrasesGratitude: user.responses, regles, theme });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des émotions' });
    }
});

router.get('/user-phraseGratitude', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
        const user = await UserModel.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const sortedResponses = user.responses.sort((a, b) => b.date.getTime() - a.date.getTime());
        const phrases = sortedResponses.map(r => ({
            phraseGratitude: r.phraseGratitude,
            date: r.date
        }))

        res.json({ phrases });
    } catch (err) {
        console.error("Erreur lors de la récupération :", err);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des phrases' });
    }
});

router.get('/api/feelings', async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'non autorisé' });
        }

        const user = await UserModel.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ feelings: user.feelings, pseudo: user.pseudo });
    } catch (error) {
        console.error("Erreur dans /getFeelings :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.post('/feelings', async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const emotions = req.body as IRequestFeeling;
        console.log()
        const user = await UserModel.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Update the user with new feeling
        user.responses.push({ ...emotions });

        // Sauvegarder l'utilisateur après modification
        await user.save();

        // Répondre avec succès
        res.status(200).json({ message: 'Feeling mis à jour et historique effacé avec succès' });
    } catch (reason) {
        console.error("Erreur dans /updateFeeling :", reason);
        res.status(500).json({ message: `Server failure, cause : ${reason}` });
    }
});


router.get('/history', async (req: Request, res: Response) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Non autorisé : utilisateur non connecté' });
    }

    try {
        const user = await UserModel.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' }).end();
        }

        const responses = user.responses.map(response => {

            const dateFormatee = format(response.date, "dd MMMM yyyy - HH:mm", { locale: fr });

            const retValue: IHistory = {
                date: dateFormatee,
                feeling1: parseInt(response.feeling1),
                feeling2: parseInt(response.feeling2),
                feeling3: parseInt(response.feeling3),
                feeling4: parseInt(response.feeling4),
                regle: Boolean(response.regle),
                phraseGratitude: response.phraseGratitude ?? ''
            }
            return retValue;
        });
        res.status(200).json(responses).end();
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'historique' }).end();
    }
});


export default router;
