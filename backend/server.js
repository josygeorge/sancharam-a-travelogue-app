const express = require('express');
const bodyParser = require('body-parser');

// Routes
const usersRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');

const app = express();

// Routes middleware
app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);

app.use((error,req,res,next) => {
if(res.headerSent) {
    return next(error);
}
res.status(error.code || 500);
})

var server = app.listen(8081, 'localhost', function () {
    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)
})