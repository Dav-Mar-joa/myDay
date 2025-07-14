import request from 'supertest';
import { app } from '../../../src/index';

describe('POST /api/register', () => {
    it('devrait retourner 201 si name est fourni', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ name: 'Jean' });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Utilisateur enregistré');
    });

    it('devrait retourner 400 si name est manquant', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Le champ "name" est requis.');
    });

    it('devrait retourner 400 si name n\'est pas une chaîne', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ name: 123 });

        expect(res.status).toBe(400);
    });
});
