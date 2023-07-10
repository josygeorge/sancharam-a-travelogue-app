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
//
//
//
// get users
//
const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (error) {
        const fetchError = new HttpError("Failed! Try again later.", 500)
        return next(fetchError);
    }
    // sending response to the browser
    res.json({
        users: users.map(user =>
            user.toObject({ getters: true })
        )
    });
};
//
//
//
/* **** signup logic **** */
//
const signup = async (req, res, next) => {

    // checking validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(validationError);
    }
    const { name, email, password } = req.body;
    // --------------
    // database checking if user exists 
    let hasUser;
    try {
        hasUser = await User.findOne({ email: email })
    } catch (error) {
        const fetchError = new HttpError("Failed! Try again later.", 500)
        return next(fetchError);
    }
    //---------
    // if user exists then error
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
    // sending response to the browser
    res.status(201).json({
        user: createdUser.toObject({
            getters: true
        })
    });
};
//
//
//
/* **** login code **** */
//
const login = (req, res, next) => {
    const { email, password } = req.body;
    let identifiedUser;
    // database fetching 
    try {
        identifiedUser = User.findOne({ email: email });
    } catch (error) {
        const fetchError = new HttpError("Fetch Failed! Try again later.", 500)
        return next(fetchError);
    }
    // login error
    if (!identifiedUser || identifiedUser.password !== password) {
        const loginError = new HttpError('Credentials seem to be wrong.', 401);
        return next(loginError)
    }
    // sending success to browser
    res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;