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
  const { limit = 50, skip = 0 } = req.query;
  (async function() {
    try {
      const polls = await Poll.list({ skip, limit });
      const count = await Poll.count();
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

      // const poll = await Poll.get(pollId);
      // if(!poll.options.id(optionId))
      //   throw new APIError('You tried to vote for non existing poll option!', httpStatus.NOT_FOUND, true);
      //
      // const savedPoll = await poll.update();

      // const poll = await Poll.findOneAndUpdate(
      //     {_id: pollId, "options._id": optionId},
      //     { $inc: { "options.$.votes": 1 }},
      //     {new: true}
      // );
      // return res.json({
      //   poll
      // });

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
