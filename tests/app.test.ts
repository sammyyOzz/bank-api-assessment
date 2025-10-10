import request from 'supertest';
import app from '../src/app';

describe('GET /', () => {
  it('responds with "Home page is working :)"', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Home page is working :)');
  });
});
