import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import config from '../config/config';
import Poll from '../models/poll.model';

/**
 * Get user polls list.
 * @property {number} req.query.skip - Number of polls to be skipped.
 * @property {number} req.query.limit - Limit number of polls to be returned.
 * @returns {data: Poll[], pagination: Pagination}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  const user = req.user.id;
  (async function() {
    try {
      const polls = await Poll.listUserPolls({ user, skip, limit });
      const count = await Poll.countUserPolls(user);
      return res.json({
        data: polls,
        pagination: {
          currentPage: ~~(skip / limit) + 1,
          totalPages: Math.ceil(count / limit),
          count,
          limit,
          skip
        }
      });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Create new poll
 * @property {string} req.body.title - Poll title.
 * @property {array[string]} req.body.options - Poll's option titles.
 * @returns {data: Poll}
 */
function create(req, res, next) {
  const poll = new Poll({
    title: req.body.title,
    options: req.body.options.map(o => ({title: o})),
    user: req.user.id
  });

  poll.save()
    .then((savedPoll) => res.json({ data: savedPoll }) )
    .catch(next);
}

/**
 * Get poll
 * @returns {data: Poll}
 */
function get(req, res, next) {
  const { pollId } = req.params;
  (async function() {
    try {
      const poll = await Poll.get(pollId);
      if(poll.user != req.user.id) throw new APIError('No permission to access this resource!', httpStatus.FORBIDDEN, true);

      return res.json({ data: poll });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Update poll
 * @property {string} req.body.title - Poll title.
 * @returns {data: Poll}
 */
function update(req, res, next) {
  const { pollId } = req.params;
  (async function() {
    try {
      const poll = await Poll.get(pollId);
      if(poll.user != req.user.id) throw new APIError('No permission to access this resource!', httpStatus.FORBIDDEN, true);

      poll.title = req.body.title;

      const updatedPoll = await poll.save();
      return res.json({ data: updatedPoll });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Delete poll.
 * @returns {data: Poll}
 */
function remove(req, res, next) {
  const { pollId } = req.params;
  (async function() {
    try {
      const poll = await Poll.get(pollId);
      if(poll.user != req.user.id) throw new APIError('No permission to access this resource!', httpStatus.FORBIDDEN, true);

      const deletedPoll = await poll.remove();
      return res.json({ data: deletedPoll });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Create new poll options
 * @property {array[string]} req.body.options - Poll's option titles.
 * @returns {data: Poll}
 */
function createOptions(req, res, next) {
  const { pollId } = req.params;
  (async function() {
    try {
      const poll = await Poll.get(pollId);
      if(poll.user != req.user.id) throw new APIError('No permission to access this resource!', httpStatus.FORBIDDEN, true);

      const { options } = req.body;
      poll.options.push(...(options.map(title => ({title: title}))));

      const updatedPoll = await poll.save();
      return res.json({ data: updatedPoll });
    } catch(error) {
      return next(error);
    }
  })();
}

export default { list, create, get, update, remove, createOptions };
