import "regenerator-runtime/runtime";
import mongoose from 'mongoose';
import config from '../config/config';
import User from '../models/user.model';
import Poll from '../models/poll.model';
import data from './data';

const { polls } = data;

mongoose.Promise = Promise;

mongoose.connect(config.mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

(async function() {
  const user = await User.findOne({}).sort('createdAt');

  polls.map(p => {
    const poll = new Poll({
      title: p.title,
      options: p.options,
      user: user.id
    });

    poll.save()
      .then((savedPoll) => console.log('Saved poll:', p.title) )
      .catch((error) => {
        console.log('Error saving poll:', p.title, error);
      });
  })
})();
