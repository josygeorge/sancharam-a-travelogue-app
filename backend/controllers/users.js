const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const User = require('../models/userSchema')

const HttpError = require('../models/http-error');

const DUMMYUSERS = [
    {
        id: 'u1',
        name: 'John Doe',
        email: 'test@test.com',
        password: 'testers'
    }
];
// get users
const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (error) {
        const fetchError = new HttpError("Failed! Try again later.", 500)
        return next(fetchError);
    }
    res.json({
        users: users.map(user =>
            user.toObject({ getters: true })
        )
    });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(validationError);
    }
    const { name, email, password } = req.body;

    // checking if user exists from database
    let hasUser;
    try {
        hasUser = await User.findOne({ email: email })
    } catch (error) {
        const fetchError = new HttpError("Failed! Try again later.", 500)
        return next(fetchError);
    }
    // if user exists
    if (hasUser) {
        const userExistsError = new HttpError('User exists! email already exists. Try login.', 422);
        return next(userExistsError);
    }
    // if new User - create a new one
    const createdUser = new User({
        name, // name: name
        email,
        password,
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80',
        places: []
    });

    // create code
    try {
        await createdUser.save();
    } catch (error) {
        const createError = new HttpError("Failed! Try again later.", 500)
        return next(createError);
    }


    res.status(201).json({ user: createdUser });
};


// login
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