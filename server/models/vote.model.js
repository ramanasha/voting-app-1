import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';

const omit = (o, ...props) => Object.assign( {}, ...(Object.keys(o).filter(prop => !props.includes(prop))).map(prop => ({[prop]: o[prop]})) );

/**
 * Vote Schema
 */
const VoteSchema = new mongoose.Schema({
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'poll',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: false,
    index: true
  },
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
}, {
  versionKey: false
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
VoteSchema.method({});

/**
 * Statics
 */
VoteSchema.statics = {
  /**
   * Checks if user not voted
   * @param {Poll} poll - The objectId of a poll.
   * @param {string} ipAddress - User's IP address.
   * @param {ObjectId|undefined} user - User's id.
   * @returns {Promise<boolean>, APIError>}
   */
  notVoted(poll, ipAddress, user) {
    return this.findOne({poll: poll, "$or": [{user: user}, {ipAddress: ipAddress}]})
      .exec()
      .then((vote) => {
        if (!vote) return true;
        return Promise.reject(new APIError('You\'ve already voted on this poll!', httpStatus.FORBIDDEN, true));
      });
  }
};

/**
 * @typedef Vote
 */
export default mongoose.model('Vote', VoteSchema, 'votingappvotes');
