const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
});

// the unique validator will check for duplicate database entries and report them just like any other validation error.
/* 
Example:
var user = new User({ username: 'JohnSmith', email: 'john.smith@gmail.com', password: 'j0hnNYb0i' });
user.save(function (err) {
    console.log(err);
});
{
    message: 'Validation failed',
    name: 'ValidationError',
    errors: {
        username: {
            message: 'Error, expected `username` to be unique. Value: `JohnSmith`',
            name: 'ValidatorError',
            kind: 'unique',
            path: 'username',
            value: 'JohnSmith'
        }
    }
}
*/

module.exports = mongoose.model('User', userSchema);