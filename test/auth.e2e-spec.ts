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

  it('handles a signup request', () => {
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
});