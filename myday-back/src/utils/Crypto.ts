const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
console.log(process.env.SECRET_KEY)
const key = Buffer.from("toto", 'hex');

export const encrypt = (text: string | boolean | number): string => {
    if (typeof text === 'number')
        text = text.toString()
    if (typeof text === 'boolean')
        text = text.toString()
    if (!text || typeof text !== 'string') return '';

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

export const decrypt = (encryptedText: string | undefined | null): string => {

    if (!encryptedText) return '';

    const [ivHex, data] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    if (decrypted === "true") decrypted = true;
    if (decrypted === "false") decrypted = false;

    return decrypted;
}

export const hashed = (text: string): string => {
    if (!text || typeof text !== 'string') return '';
    return crypto.createHash('sha256').update(text).digest('hex');
}


