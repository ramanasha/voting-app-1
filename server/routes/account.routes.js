import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../config/param-validation';
import authCtrl from '../controllers/auth.controller';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login)

router.route('/register')
  .post(validate(paramValidation.register), authCtrl.register);

// router.route('/forgot')
//   .post(validate(paramValidation.forgot), authCtrl.forgot);
//
// router.route('/reset/:token')
//   .post(validate(paramValidation.resetPassword), authCtrl.reset);

export default router;
