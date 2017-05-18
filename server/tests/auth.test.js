import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../index';
import config from '../config/config';
import User from '../models/user.model';

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  const validUserData = {
    "email": "tester@example.com",
    "firstName": "Tester",
    "lastName": "Testing",
    "password": "tester",
    "confirmPassword": "tester"
  };

  const validUserCredentials = {
    email: 'tester@example.com',
    password: 'tester'
  };

  const invalidUserData = {
    email: 'testerinvalid@example.com',
    password: 'IDontKnow'
  };

  let jwtToken;
  let user;

  describe('# POST /api/auth/register', () => {
    it('should fail to register new user', (done) => {
      request(app)
        .post('/api/auth/register')
        .send(invalidUserData)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error.message).to.contain('"confirmPassword" is required');
          done();
        })
        .catch(done);
    });

    it('should register new user and return user data and JWT token', (done) => {
      request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('user');
          user = res.body.data.user;
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should return Authentication error', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(invalidUserData)
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.error.message).to.contain('Invalid');
          done();
        })
        .catch(done);
    });

    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.data).to.have.property('token');
          jwt.verify(res.body.data.token, config.jwtSecret, (err, decoded) => {
            expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
            expect(decoded.email).to.equal(validUserCredentials.email);
            jwtToken = `Bearer ${res.body.data.token}`;
            done();
          });
        })
        .catch(done);
    });
  });

  // describe('# POST /api/auth/forgot', () => {
  //   it('should return error', (done) => {
  //     done()
  //   });
  //
  //   it('should return ok status', (done) => {
  //     done();
  //   });
  // });

  // describe('# POST /api/auth/reset/:token', () => {
  //   let resetPasswordToken;
  //
  //   before(function(done) {
  //     co(function* () {
  //       const u = yield User.get(user.id);
  //       resetPasswordToken = u.resetPasswordToken;
  //       done();
  //     });
  //   });
  //
  //   it('should fail to reset password due to invalid token', (done) => {
  //     request(app)
  //       .post('/api/auth/reset/1234')
  //       .send({
  //         "password": "newpass",
  //         "confirmPassword": "newpass"
  //       })
  //       .expect(httpStatus.NOT_FOUND)
  //       .then((res) => {
  //         expect(res.body.error.message).to.contain('invalid');
  //         expect(res.body.error.message).to.contain('expired');
  //         done();
  //       })
  //       .catch(done);
  //   });
  //
  //   it('should reset password', (done) => {
  //     request(app)
  //       .post('/api/auth/reset/' + resetPasswordToken)
  //       .send({
  //         "password": "newpass",
  //         "confirmPassword": "newpass"
  //       })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });

  after(function(done) {
    (async function() {
      try{
        const u = await User.get(user.id);
        if(u) u.remove();
      } catch(err) {}

      done();
    })();
  });

});
