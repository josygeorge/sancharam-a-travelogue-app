const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const HttpError = require('./models/httpError');

// Routes
const usersRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');

dotenv.config();
/* -------------------
 Create express app
---------------------- */
const app = express();

/* ----------------
 Apply middleware/s
------------------- */
// 1. Cors function 
app.use(cors())

// 2. Body Parser middleware to parse any incoming req
app.use(bodyParser.json());

// Routes middleware
app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);

// handling errors for unsupported routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find the route!', 404);
    throw error;
})

// Error middleware
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'Unknown error occured!' });
})

var server = app.listen(8081, 'localhost', function () {
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})