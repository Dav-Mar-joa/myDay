
import { Router, Request, Response } from 'express';
import UserModel from '../model/User';
import bcrypt from "bcryptjs";

const registerRouter = Router();

registerRouter.post('/', async (request: Request, response: Response) => {
    const { pseudo, password, feelings, mail, phraseRegister } = request.body;
    const theme = request.body.theme || "colorful";
    const pseudoExist = await UserModel.findOne({ pseudo })
    const mailExist = await UserModel.findOne({ mail: mail })

    if (pseudoExist) {
        return response.status(409).json({ success: false, message: 'Pseudo déjà utilisé' });
    }
    else if (mailExist) {
        return response.status(409).json({ success: false, message: 'Email déjà utilisé' });
    }
    else {
        const newUser = new UserModel({
            pseudo,
            password: password,
            feelings: feelings,
            mail: mail,
            mailHash: mail,
            theme: theme || 'colorful',
            phraseRegister: phraseRegister
        });
        try {
            await newUser.save();
            console.log('Utilisateur enregistré avec succès !');
            response.status(201).json({ message: 'Utilisateur créé avec succès' });
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', err);
            response.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
        }
    }
});

export default registerRouter;
