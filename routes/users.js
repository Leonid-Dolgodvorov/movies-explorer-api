const router = require('express').Router();

const { validateProfile } = require('../middlewares/validation');

const {
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateProfile, updateProfile);

module.exports = router;
