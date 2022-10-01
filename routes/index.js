const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const {
  createUser, login,
} = require('../controllers/users');
const { NotFoundError } = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const {
  validateSignIn,
  validateSignUp,
} = require('../middlewares/validation');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUser);

router.use('/', auth);

router.use('/', usersRouter);
router.use('/', moviesRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

module.exports = router;
