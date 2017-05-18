import config from '../config/config';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import User from '../models/user.model';
// import crypto from 'crypto'; // required for password reset

/**
 * Returns jwt token if valid email and password are provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  const { email, password } = req.body;

  (async function() {
    try {
      const user = await User.findOne({email}).exec();
      if(!user) throw new APIError('Invalid email address', httpStatus.UNAUTHORIZED, true);

      const matchPass = await user.comparePassword(password);
      if(!matchPass) throw new APIError('Invalid password', httpStatus.UNAUTHORIZED, true);

      const token = jwt.sign(user.toObject(), config.jwtSecret);
      return res.json({
        data: {
          token: token,
          user: user
        }
      });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Returns jwt token upon successful registration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function register(req, res, next) {
  const user = new User({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password });

  (async function() {
    try {
      const newUser = await user.save();
      const token = jwt.sign(newUser.toObject(), config.jwtSecret);
      return res.json({
        data: {
          token: token,
          user: newUser
        }
      });
    } catch(error) {
      if(!(error instanceof APIError)) {
        return next(new APIError('Email address already in use', httpStatus.CONFLICT, true));
      }
      return next(error);
    }
  })();
}

export default { login, register };
