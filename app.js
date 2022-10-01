require('dotenv').config();

const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const corsOptions = require('./middlewares/corsOptions');

const commonRouter = require('./routes/index');

const { PORT = 3000, MONGODB = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

app.use('*', cors(corsOptions));
app.use(rateLimiter);
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB);

app.use(requestLogger);

app.use(commonRouter);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
