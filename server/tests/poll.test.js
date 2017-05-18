import request from 'supertest';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../index';
import config from '../config/config';
import Poll from '../models/poll.model';
import User from '../models/user.model';

chai.config.includeStack = true;

describe('## Poll APIs', () => {
  const userData = {
    "email": "testeraccount@example.com",
    "firstName": "Tester",
    "lastName": "Testing",
    "password": "tester",
    "confirmPassword": "tester"
  };

  const pollData = {
    title: "Who will win the elections?",
    options: [
      "James Bond",
      "Michael Jordan"
    ]
  };

  const invalidPollData = {
    title: "",
    options: []
  }

  let jwtToken;
  let user;
  let poll;

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
  });

  describe('# POST /api/manage/polls', () => {
    it('should fail because of invalid data', (done) => {
      request(app)
        .post('/api/manage/polls')
        .set('Authorization', jwtToken)
        .send(invalidPollData)
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should create a poll', (done) => {
      request(app)
        .post('/api/manage/polls')
        .set('Authorization', jwtToken)
        .send(pollData)
        .expect(httpStatus.OK)
        .then((res) => {
          const options = res.body.data.options;
          expect(res.body.data.user).to.equal(user.id);
          expect(res.body.data.title).to.equal(pollData.title);
          expect(options[0].title).to.equal(pollData.options[0]);
          poll = res.body.data;
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/manage/polls/:pollId', () => {
    it('should fail because of invalid data', (done) => {
      request(app)
        .put(`/api/manage/polls/${poll.id}`)
        .set('Authorization', jwtToken)
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should update a poll', (done) => {
      const updatePoll = { title: 'Poll new title' };
      request(app)
        .put(`/api/manage/polls/${poll.id}`)
        .set('Authorization', jwtToken)
        .send(updatePoll)
        .expect(httpStatus.OK)
        .then((res) => {
          const options = res.body.data.options;
          expect(res.body.data.user).to.equal(user.id);
          expect(res.body.data.title).to.equal(updatePoll.title);
          expect(options[0].title).to.equal(pollData.options[0]);
          poll = res.body.data;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/manage/polls', () => {
    it('should get user\s polls', (done) => {
      request(app)
        .get('/api/manage/polls')
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('pagination');
          expect(res.body.data).to.be.instanceof(Array);
          expect(res.body.data).to.have.length.above(0);
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/manage/polls/:pollId/options', () => {
    it('should fail because of invalid data', (done) => {
      request(app)
        .post(`/api/manage/polls/${poll.id}/options`)
        .set('Authorization', jwtToken)
        .send({
          options: []
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should add options to a poll', (done) => {
      const newOption = 'Some random title';
      request(app)
        .post(`/api/manage/polls/${poll.id}/options`)
        .set('Authorization', jwtToken)
        .send({ options: [newOption] })
        .expect(httpStatus.OK)
        .then((res) => {
          const options = res.body.data.options.slice();
          const len = options.length;
          expect(res.body.data.user).to.equal(user.id);
          expect(res.body.data.title).to.equal(poll.title);
          expect(options[len - 1].title).to.equal(newOption);
          poll = res.body.data;
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/manage/polls/:pollId', () => {
    it('should fail because of invalid :pollId', (done) => {
      request(app)
        .delete(`/api/manage/polls/191cb7a44987b9318323fbf7`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.error).to.have.property('message');
          done();
        })
        .catch(done);
    });

    it('should delete a poll', (done) => {
      request(app)
        .delete(`/api/manage/polls/${poll.id}`)
        .set('Authorization', jwtToken)
        .expect(httpStatus.OK)
        .then((res) => {
          const options = res.body.data.options;
          expect(res.body.data.user).to.equal(user.id);
          expect(res.body.data.title).to.equal(poll.title);
          expect(options[0].title).to.equal(poll.options[0].title);
          poll = res.body.data;
          done();
        })
        .catch(done);
    });
  });

  after(function(done) {
    (async function() {
      try { const p = await Poll.remove() } catch(err) { }
      try { const u = await User.remove() } catch(err) { }

      done();
    })();
  });
});
