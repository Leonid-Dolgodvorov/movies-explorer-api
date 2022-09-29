const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/NotFoundError');
const { NotValidDataError } = require('../errors/NotValidDataError');
const { ConflictError } = require('../errors/ConflictError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка создания карточки фильма: переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Ошибка создания фильма: фильм уже существует'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(() => new NotFoundError('Ошибка: фильм не найден'))
    .then((movie) => {
      if (req.user._id !== movie.owner._id.toString()) {
        next(new ForbiddenError('Ошибка: невозможно удалить фильм из чужого избранного'));
      } else {
        Movie.findByIdAndRemove(movieId)
          .then(() => {
            res.send({ message: 'Фильм удален из избранного' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidDataError('Ошибка удаления фильма из избранного: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUserMovies = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => res.status(200).send({ data: movies }))
  .catch((err) => {
    next(err);
  });

module.exports = {
  createMovie,
  deleteMovie,
  getUserMovies,
};
