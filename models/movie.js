const mongoose = require('mongoose');
const { validateUrl } = require('../middlewares/validation');

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Ошибка: добавьте страну производства'],
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: [true, 'Ошибка: добавьте имя режиссера'],
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: [true, 'Ошибка: добавьте длительность фильма (в цифровом виде)'],
  },
  year: {
    type: String,
    required: [true, 'Ошибка: добавьте год выхода фильма'],
    minlength: 4,
    maxlength: 4,
  },
  description: {
    type: String,
    required: [true, 'Ошибка: добавьте описание фильма'],
    minlength: 2,
    maxlength: 200,
  },
  image: {
    type: String,
    required: [true, 'Ошибка: добавьте ссылку на постер фильма'],
    validate: validateUrl,
  },
  trailerLink: {
    type: String,
    required: [true, 'Ошибка: добавьте ссылку на трейлер фильма'],
    validate: validateUrl,
  },
  thumbnail: {
    type: String,
    required: [true, 'Ошибка: добавьте ссылку на миниатюрное изображение постера к фильму'],
    validate: validateUrl,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    minlength: 2,
    required: [true, 'Ошибка: добавьте название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    minlength: 2,
    required: [true, 'Ошибка: добавьте название фильма на английском языке'],
  },
});

const Movie = mongoose.model('Movie', userSchema);

module.exports = Movie;
