import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle a signup request', () => {
    const originalEmail = 'bbb@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: originalEmail, password: 'pass' })
      .expect(201)
      .then(response => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(originalEmail);
      });
  });

  it('should signup as a new user then get the currently logged in user', async () => {
    const email = 'test@test.com';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});