const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/NotFoundError');
const { NotValidDataError } = require('../errors/NotValidDataError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка создания карточки фильма: переданы некорректные данные'));
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
          .then((film) => {
            res.send({ message: `Фильм '${film.nameRU}' удален из избранного` });
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
