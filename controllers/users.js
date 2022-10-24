require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { NotValidDataError } = require('../errors/NotValidDataError');
const { ConflictError } = require('../errors/ConflictError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.status(201).send({
      data: {
        name,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка создания пользователя: переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Ошибка создания пользователя: пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidDataError('Переданы некорректные данные для получения пользователя'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Ошибка: пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка обновления данных пользователя: переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Ошибка обновления данных пользователя: пользователь с данным email существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Ошибка авторизации');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  getCurrentUser,
  updateProfile,
  login,
};
