import express from 'express';
import accountRoutes from './account.route';
import authRoutes from './auth.route';
import managePollRoutes from './poll.route';
import pollRoutes from './public/poll.route';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));

// Authentication and signup
router.use('/auth', authRoutes);

// Manage account and polls
router.use('/account', accountRoutes);
router.use('/manage/polls', managePollRoutes);

// View polls and vote [public]
router.use('/polls', pollRoutes);

export default router;
