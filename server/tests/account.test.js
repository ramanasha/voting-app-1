import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../index';
import config from '../config/config';
import User from '../models/user.model';

chai.config.includeStack = true;

describe('## Account APIs', () => {
  const userData = {
    "email": "testeraccount@example.com",
    "firstName": "Tester",
    "lastName": "Testing",
    "password": "tester",
    "confirmPassword": "tester"
  };

  const invalidUserData = {
    "email": "testeraccount",
    "firstName": "Tester"
  };

  let jwtToken;
  let user;

  before(function(done) {
    request(app)
      .post('/api/auth/register')
      .send(userData)
      .then((res) => {
        jwtToken = `Bearer ${res.body.data.token}`;
        user = res.body.data.user;
        done();
      })
      .catch(done);
  })

  describe('# GET /api/account', () => {
    it('should fail because of wrong token', (done) => {
      request(app)
        .get('/api/account')
        .set('Authorization', 'Bearer inValidToken')
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.error.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    it('should get user account data', (done) => {
      request(app)
        .get('/api/account')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.data).to.deep.equal(user);
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/account', () => {
    it('should fail because of invalid data', (done) => {
      request(app)
        .post('/api/account')
        .set('Authorization', jwtToken)
        .send(invalidUserData)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          // expect(res.body.error.message).to.contain('Validation error');
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should update user\'s account data', (done) => {
      request(app)
        .post('/api/account')
        .set('Authorization', jwtToken)
        .send(
          Object.assign({}, userData, {
            "email": "testeremail@example.com",
            "firstName": "Name",
            "lastName": "Last Name"
          })
        )
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.data.user).to.deep.equal(
            Object.assign({}, user, {
              "email": "testeremail@example.com",
              "firstName": "Name",
              "lastName": "Last Name"
            })
          );
          expect(res.body.data).to.have.property('token');
          jwtToken = `Bearer ${res.body.data.token}`;
          user = res.body.data.user;
          done();
        })
        .catch(done);
    });
  });

  after(function(done) {
    User.get(user.id)
      .then(u => {
        u.remove();
        done();
      })
      .catch(done);
  });

});
