const express = require('express');

const { check } = require('express-validator');
const { getUsers, signup, login } = require('../controllers/users');

const router = express.Router();
// route - get all users
router.get('/', getUsers);
// signup route - check using validator
router.post(
    '/signup',
    [
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({ min: 6 })
    ],
    signup
);
// login route
router.get('/login', login);

module.exports = router;