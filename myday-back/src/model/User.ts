import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
    feeling1: { type: String, required: true },
    feeling2: { type: String, required: true },
    feeling3: { type: String, required: true },
    feeling4: { type: String, required: true },
    phraseGratitude: { type: String },
    regle: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
});

const userSchema = new mongoose.Schema({
    pseudo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mail: { type: String, required: true },
    mailHash: { type: String },
    feelings: [{ type: String }],
    responses: [responseSchema],
    theme: { type: String, default: 'colorful' },
    phraseRegister: { type: String, required: true },
    isAdmin: { type: String, required: false }
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;