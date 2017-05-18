import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../config/param-validation';
import pollCtrl from '../controllers/poll.controller';
import config from '../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.use(expressJwt({ secret: config.jwtSecret }));

router.route('/')
  .get(pollCtrl.list)
  .post(validate(paramValidation.createPoll), pollCtrl.create);

router.route('/:pollId')
  .get(validate(paramValidation.getPoll), pollCtrl.get)
  .put(validate(paramValidation.updatePoll), pollCtrl.update)
  .delete(validate(paramValidation.deletePoll), pollCtrl.remove);

router.route('/:pollId/options')
  .post(validate(paramValidation.createPollOptions), pollCtrl.createOptions)

export default router;
