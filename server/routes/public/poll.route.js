import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import pollCtrl from '../../controllers/public/poll.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.use(expressJwt({ secret: config.jwtSecret, credentialsRequired: false}));

router.route('/')
  .get(pollCtrl.list);

router.route('/:pollId')
  .get(validate(paramValidation.getPoll), pollCtrl.get)

router.route('/:pollId/vote/:optionId')
  .get(validate(paramValidation.votePoll), pollCtrl.vote)

export default router;
