
const HttpError = require('../models/httpError');
const { v4: uuid } = require('uuid');

// dummy data
const DUMMYPLACES = [
    {
        id: 'p1',
        title: 'Aga Khan Museum',
        description: 'Museum noted for its bright white, contemporary architecture & exhibits tracing Islamic culture.',
        location: {
            lat: 43.717899,
            lng: -79.6582408,
        },
        address: '77 Wynford Dr, North York, ON M3C 1K1',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Toronto Museum',
        description: 'Toronto Museum noted for its bright white, contemporary architecture & exhibits tracing Islamic culture.',
        location: {
            lat: 43.717899,
            lng: -79.6582408,
        },
        address: '33 Wynford Dr, Toronto, ON M3C 1K1',
        creator: 'u2'
    },

]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMYPLACES.find(p => {
        return p.id === placeId;
    });
    if (!place) {
        const error = new HttpError('Place not found for the search!', 404);
        throw error;
    }
    res.json({
        place,
    });
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = DUMMYPLACES.find(p => {
        return p.creator === userId;
    });
    if (!place) {
        return next(new HttpError('Place not found for the user!', 404));
    }
    res.json({
        place,
    });
};

const createPlace = (req, res, next) => {
    const {
        title,
        description,
        coordinates,
        address,
        creator } = req.body;
    const newPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMYPLACES.push(newPlace); // unshift to add in the beginning
    res.status(201).json({ place: newPlace });
}
const updatePlace = (req, res, next) => {

}
const deletePlace = (req, res, next) => {

}



exports.getPlaceById = getPlaceById; // => exports.anyname = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace; 