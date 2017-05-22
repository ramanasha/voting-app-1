import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../errors/APIError';
import config from '../config/config';
import Poll from '../models/poll.model';
import Vote from '../models/vote.model';

/**
 * Get user polls list.
 * @property {number} req.query.skip - Number of polls to be skipped.
 * @property {number} req.query.limit - Limit number of polls to be returned.
 * @returns {data: Poll[], pagination: Pagination}
 */
function list(req, res, next) {
  const { page = 1 } = req.query;
  const user = req.user.id;
  (async function() {
    try {
      const count = await Poll.countUserPolls(user);
      const limit = 10;
      const totalPages = Math.ceil(count / limit);
      const currentPage = page < 1 ? 1 : (page > totalPages ? totalPages : page);
      const skip = Math.max(0, (currentPage - 1) * limit);

      const polls = await Poll.listUserPolls({ user, skip, limit });
      return res.json({
        data: polls,
        pagination: {
          page: +currentPage,
          totalPages,
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
      poll.options.push(...(req.body.options.map(title => ({title: title}))));

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

      const votes = await Vote.remove({poll: pollId});
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
