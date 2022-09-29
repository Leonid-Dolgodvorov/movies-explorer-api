const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const {
  createUser, login,
} = require('./controllers/users');
const { NotFoundError } = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');

const app = express();

const options = {
  origin: [
    'http://localhost:3010',
    'https://dolgodvorovl.nomoredomains.icu',
    'http://dolgodvorovl.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { PORT } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), createUser);

app.use('/', auth);

app.use('/', usersRouter);
app.use('/', moviesRouter);

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
