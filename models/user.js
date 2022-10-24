const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { validateEmail } = require('../middlewares/validation');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Ошибка: добавьте имя пользователя'],
  },
  email: {
    type: String,
    required: [true, 'Ошибка: добавьте email'],
    unique: true,
    validate: validateEmail,
  },
  password: {
    type: String,
    required: [true, 'Ошибка: добавьте пароль, минимум 5 знаков'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
