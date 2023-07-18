const Place = require('../models/placeSchema');
const User = require('../models/userSchema')


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
// 

//
// get place by ID
//
const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    // fetching place
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const fetchError = new HttpError('Failed! Could not find a place. Try again.', 500);
        return next(fetchError);
    }

    if (!place) {
        const notFoundError = new HttpError('Place not found!', 404);
        return next(notFoundError);
    }
    // sending response to the browser
    res.json({
        place: place.toObject({ getters: true })
    });
};
//

//
// get places by user ID
//
const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    // fetching places by user Id
    let userPlaces;
    try {
        userPlaces = await User.findById(userId).populate('places');
    } catch (error) {
        const fetchError = new HttpError('Failed! Could not fetch. Try again.', 500);
        return next(fetchError);
    }

    // Not found places for the user -ERROR
    if (!userPlaces || userPlaces.places.length === 0) {
        const notFoundError = new HttpError('Place not found for the user!', 404);
        return next(notFoundError);
    }
    // sending response to the browser - bylooping places for the user
    res.json({
        places: userPlaces.places.map(place => place.toObject({ getters: true }))
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
    const { title, description } = req.body;
    const placeID = req.params.pid;

    const updatedPlace = { ...DUMMYPLACES.find(p => p.id === placeID) };
    const placeIndex = DUMMYPLACES.findIndex(p => p.id === placeID);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMYPLACES[placeIndex] = updatedPlace;

    res.status(200).json({ place: updatedPlace });

}
const deletePlace = (req, res, next) => {
    const placeID = req.params.pid;
    if (!DUMMYPLACES.find(p => p.id === placeID)) {
        throw new HttpError('Could not find a place for that id.', 404);
    }
    DUMMYPLACES = DUMMYPLACES.filter(p => p.id !== placeID);
    res.status(200).json({ message: 'Place Deleted.' });
}



exports.getPlaceById = getPlaceById; // => exports.anyname = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace; 