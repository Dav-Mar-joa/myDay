
export type Emotion = "Distraction" | "Tristesse" | "Chagrin"
    | "Dégoût" | "Aversion" | "Etonnement" | "Surprise"
    | "Vigilance" | "Anticipation" | "Interêt" | "Ennui"
    | "Appréhension" | "Admiration" | "Confiance" | "Acceptation"
    | "Terreur" | "Peur"
    | "Colère" | "Rage" | "Extase" | "Joie"
    | "Contrariété" | "Songerie" | "Aggressivité" | "Optimisme"
    | "Amour" | "Soumission" | "Crainte" | "Mépris" | "Remords"
    | "Désappointement" | "Stress" | "Sérénité";

// Méthode : Anglais => Francais pour pouvoir le présenter bien comme il faut ! 

export interface User {
    emotions: Emotion[];
}

export interface UserRegistration {
    mail: string;
    password: string;
    pseudo: string;
    phraseRegister: string; // Nothing in my version
    feelings: string[]; // Map to emotions
}

export interface EmotionDetailItem {
    dateUTC: string;
    rating: number;
}

export interface EmotionDetails {
    history: EmotionDetailItem[]
}

export interface UserDetails extends User {
    details: [EmotionDetails, EmotionDetails, EmotionDetails, EmotionDetails];
}

//
// 
// 

export interface IUser {
    _id: string,
    username: string
    feelings: string[], // List of emotions

}

export interface IFeelings {
    feelings: string[], // List of emotions
    phrasesGratitude: string[],
    regles: string[]
}

export interface IErrorResponse {
    errorMessage: string;
}


export type ContextType = { user: IUser, logout: () => void, loading: boolean };