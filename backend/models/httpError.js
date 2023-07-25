class HttpError extends Error {
    // constructor
    constructor(message, errorCode) {
        super(message); // adds message as property
        this.code = errorCode; // adds code property
    }
}

module.exports = HttpError;