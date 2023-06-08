const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const DUMMYUSERS = [
    {
        id: 'u1',
        name: 'John Doe',
        email: 'test@test.com',
        password: 'testers'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMYUSERS });
};

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    const { name, email, password } = req.body;

    const hasUser = DUMMYUSERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError('Could not create user, email already exists.', 422);
    }

    const createdUser = {
        id: uuid(),
        name, // name: name
        email,
        password
    };

    DUMMYUSERS.push(createdUser);

    res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMYUSERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }

    res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;