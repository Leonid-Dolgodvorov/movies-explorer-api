const {
  celebrate,
  Joi,
} = require('celebrate');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const validateEmail = {
  validator: (input) => isEmail(input),
  message: 'Неправильный формат почты',
};

const validateUrl = {
  validator: (input) => isUrl(input),
  message: 'Неправильный формат ссылки',
};

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(200),
    image: Joi.string().min(2).required().pattern(/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
    trailerLink: Joi.string().min(2).required().pattern(/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
    thumbnail: Joi.string().min(2).required().pattern(/^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().min(24),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateEmail,
  validateUrl,
  validateProfile,
  validateMovie,
  validateDeleteMovie,
  validateSignIn,
  validateSignUp,
};
