'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config/config');

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../errors/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import crypto from 'crypto'; // required for password reset

/**
 * Returns jwt token if valid email and password are provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;


  _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var user, matchPass, token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _user2.default.findOne({ email: email }).exec();

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 6;
              break;
            }

            throw new _APIError2.default('Invalid email address', _httpStatus2.default.UNAUTHORIZED, true);

          case 6:
            _context.next = 8;
            return user.comparePassword(password);

          case 8:
            matchPass = _context.sent;

            if (matchPass) {
              _context.next = 11;
              break;
            }

            throw new _APIError2.default('Invalid password', _httpStatus2.default.UNAUTHORIZED, true);

          case 11:
            token = _jsonwebtoken2.default.sign(user.toObject(), _config2.default.jwtSecret);
            return _context.abrupt('return', res.json({
              data: {
                token: token,
                user: user
              }
            }));

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', next(_context.t0));

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 15]]);
  }))();
}

/**
 * Returns jwt token upon successful registration
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function register(req, res, next) {
  var user = new _user2.default({ email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password });

  _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    var newUser, token;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return user.save();

          case 3:
            newUser = _context2.sent;
            token = _jsonwebtoken2.default.sign(newUser.toObject(), _config2.default.jwtSecret);
            return _context2.abrupt('return', res.json({
              data: {
                token: token,
                user: newUser
              }
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);

            if (_context2.t0 instanceof _APIError2.default) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt('return', next(new _APIError2.default('Email address already in use', _httpStatus2.default.CONFLICT, true)));

          case 12:
            return _context2.abrupt('return', next(_context2.t0));

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 8]]);
  }))();
}

exports.default = { login: login, register: register };
