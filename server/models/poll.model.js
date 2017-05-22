import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';

const omit = (o, ...props) => Object.assign( {}, ...(Object.keys(o).filter(prop => !props.includes(prop))).map(prop => ({[prop]: o[prop]})) );

/**
 * Poll Option Schema
 */
const OptionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
}, {
  toObject: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v")
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v")
  }
});

/**
 * Poll Schema
 */
const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true
  },
  votes: {
    type: Number,
    default: 0
  },
  options: {
    type: [OptionSchema],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toObject: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v")
  },
  toJSON: {
    virtuals: true,
    transform: (doc, ret, opts) => omit(ret, "_id", "__v")
  }
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
PollSchema.method({});

/**
 * Statics
 */
PollSchema.statics = {
  /**
   * Get poll
   * @param {ObjectId} id - The objectId of a poll.
   * @returns {Promise<Poll, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((poll) => {
        if (poll) return poll;
        return Promise.reject(new APIError('Poll not found!', httpStatus.NOT_FOUND, true));
      });
  },

  /**
   * Vote poll
   * @param {ObjectId} id - The objectId of a poll.
   * @param {ObjectId} optionId - The objectId of a poll option.
   * @returns {Promise<Poll, APIError>}
   */
  vote(id, optionId) {
    return this.findOneAndUpdate(
        {_id: id, "options._id": optionId},
        { $inc: { "votes": 1, "options.$.votes": 1 }},
        {new: true})
      .exec()
      .then((poll) => {
        if (poll) return poll;
        return Promise.reject(new APIError('Vote on non existing poll option!', httpStatus.NOT_FOUND, true));
      })
  },

  /**
   * List polls in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of polls to be skipped.
   * @param {number} limit - Limit number of polls to be returned.
   * @returns {Promise<Poll[]>}
   */
  list({ skip = 0, limit = 10 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * List user's polls in descending order of 'createdAt' timestamp.
   * @param {ObjectId} user - The user's objectId owner of the polls.
   * @param {number} skip - Number of polls to be skipped.
   * @param {number} limit - Limit number of polls to be returned.
   * @returns {Promise<Poll[]>}
   */
  listUserPolls({ user = 0, skip = 0, limit = 10 } = {}) {
    return this.find({user: user})
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  /**
   * Count user's polls.
   * @param {ObjectId} user - The user's objectId owner of the polls.
   * @returns {Promise<number>}
   */
  countUserPolls(user = 0) {
    return this.count({user: user}).exec();
  }
};

/**
 * @typedef Poll
 */
export default mongoose.model('Poll', PollSchema, 'votingapppolls');
