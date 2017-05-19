import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';

const omit = (o, ...props) => Object.assign( {}, ...(Object.keys(o).filter(prop => !props.includes(prop))).map(prop => ({[prop]: o[prop]})) );
/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  password: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toObject: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v", "password", "resetPasswordToken", "resetPasswordExpires")
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v", "password", "resetPasswordToken", "resetPasswordExpires")
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

/**
 * Methods
 */
UserSchema.method({
  comparePassword: function(password) {
    return bcrypt.compare(password, this.password);
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) return user;
        const err = new APIError('User not found!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  /**
   * Get user
   * @param {email} email - The email of user.
   * @returns {Promise<User, APIError>}
   */
  getByEmail(email) {
    return this.findOne({email: email})
      .exec()
      .then((user) => {
        if (user) return user;
        const err = new APIError(`User <${email}> not found!`, httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema, 'votingappusers');
