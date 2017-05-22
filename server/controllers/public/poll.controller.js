import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../../errors/APIError';
import config from '../../config/config';
import Poll from '../../models/poll.model';
import Vote from '../../models/vote.model';

/**
 * Get user polls list.
 * @property {number} req.query.skip - Number of polls to be skipped.
 * @property {number} req.query.limit - Limit number of polls to be returned.
 * @returns {data: Poll[], pagination: Pagination}
 */
function list(req, res, next) {
  // const { limit = 10, skip = 0 } = req.query;
  const { page = 1 } = req.query;
  (async function() {
    try {
      const count = await Poll.count();
      const limit = 10;
      const totalPages = Math.ceil(count / limit);
      const currentPage = page < 1 ? 1 : (page > totalPages ? totalPages : page);
      const skip = Math.max(0, (currentPage - 1) * limit);

      const polls = await Poll.list({ skip, limit });
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
 * Get poll
 * @returns {data: Poll}
 */
function get(req, res, next) {
  const { pollId } = req.params;
  (async function() {
    try {
      const poll = await Poll.get(pollId);
      return res.json({ data: poll });
    } catch(error) {
      return next(error);
    }
  })();
}

/**
 * Vote poll
 * @returns {data: Poll}
 */
function vote(req, res, next) {
  const { pollId, optionId } = req.params;
  (async function() {
    const userId = req.user ? req.user.id : undefined;
    try {
      const notVoted = await Vote.notVoted(pollId, req.ip, userId);
      const poll = await Poll.vote(pollId, optionId);
      const vote = new Vote({ poll: pollId, user: userId, ipAddress: req.ip });
      const savedVote = await vote.save();

      return res.json({ data: poll });
    } catch(error) {
      return next(error);
    }
  })();
}

export default { list, get, vote };
