import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../config/param-validation';
import accountCtrl from '../controllers/account.controller';
import config from '../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.use(expressJwt({ secret: config.jwtSecret }));

router.route('/')
  .get(accountCtrl.fetch)
  .post(validate(paramValidation.updateAccount), accountCtrl.update);

export default router;
