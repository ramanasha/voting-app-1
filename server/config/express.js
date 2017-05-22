import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import config from './config';
import routes from '../routes/index.route';
import APIError from '../errors/APIError';
import path from 'path';

const app = express();

app.set('trust proxy');

// if (config.env === 'development') {
//   app.use(logger('dev'));
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(helmet());
app.use(cors());


app.use('/', express.static('client/dist'));

// mount all routes on /api path
app.use('/api', routes);

// all non-API call return the index.html file with the angular app
const router = express.Router(); // eslint-disable-line new-cap
router.use('/*', function(req, res){
  return res.sendFile('index.html', {
    root: 'client/dist/'
  });
});
app.use(router);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  // const err = new APIError('API not found', httpStatus.NOT_FOUND);
  const err = new APIError('API endpoint not found', httpStatus.NOT_FOUND, true); // true required to send custom message otherwise sends 'Not Found'
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {// eslint-disable-line no-unused-vars
  let error = {
    message: err.isPublic ? err.message : httpStatus[err.status],
    name: err.name,
    statusCode: err.status
  };
  if(config.env === 'development') error.stack = err.stack;

  return res.status(err.status).json({error});
});

export default app;
