const router = require('express').Router();

const {
  validateMovie,
  validateDeleteMovie,
} = require('../middlewares/validation');

const {
  createMovie,
  deleteMovie,
  getUserMovies,
} = require('../controllers/movies');

router.get('/movies', getUserMovies);
router.post('/movies', validateMovie, createMovie);
router.delete('/movies/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
