import { Router, Request, Response } from 'express';

const router = Router();

router.post('/logout', (request: Request, response: Response) => {
    if (request.session.user) {
        request.session.destroy((err) => {
            if (err) {
                return response.status(500).json({ message: 'Erreur lors de la déconnexion' });
            }
            response.clearCookie('connect.sid', { path: '/' });
            response.status(200).json({ message: 'Déconnexion réussie' });
        });
    } else {
        response.status(400).json({ message: 'Aucun utilisateur connecté' });
    }
});

export default router;