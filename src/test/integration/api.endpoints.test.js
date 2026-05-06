import request from 'supertest';
import app from '../../../src/app.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import JwtService from '../../../src/infrastructure/security/jwt.service.js';

describe('Integración - API Completa', () => {
    
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('1. Healthcheck Endpoint', () => {
        test('GET /api/health debería devolver 200 OK y estado', async () => {
            const response = await request(app).get('/api/health');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
        });
    });

    describe('2. Endpoints de Notas (Protegidos con JWT)', () => {
        let validToken;

        beforeAll(() => {
            validToken = JwtService.generateToken({
                id: 'usuario_falso_123',
                email: 'test@test.com',
                role: 'user'
            });
        });

        test('GET /api/v1/notes debería fallar si no se envía Token (401)', async () => {
            const response = await request(app).get('/api/v1/notes');
            expect(response.statusCode).toBe(401);
        });

        test('POST /api/v1/notes debería fallar si falta el Título (400)', async () => {
            const response = await request(app)
                .post('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`)
                .send({ content: 'Contenido sin titulo' });
            
            expect(response.statusCode).toBeGreaterThanOrEqual(400);
        });

        test('GET /api/v1/notes debería ser exitoso si se envía Token válido (200)', async () => {
            const response = await request(app)
                .get('/api/v1/notes')
                .set('Authorization', `Bearer ${validToken}`);
            
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBeTruthy();
        });
    });
});