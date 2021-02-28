import request from 'supertest';
import { app } from '../app';

describe('Ping route', () => {
    it('should be able to ping the server', () => {
        request(app)
            .get('/')
            .expect('Pong')
    })
})