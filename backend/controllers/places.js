const { validationResult } = require('express-validator')
const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location')
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
    // sending response to the browser - by looping places for the user
    res.json({
        places: userPlaces.places.map(place => place.toObject({ getters: true }))
    });
};
//

//
// Code - create place
//
const createPlace = async (req, res, next) => {
    // checking validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(validationError);
    }
    const {
        title,
        description,
        address,
        creator } = req.body;

    // get coordinates by passing address to the function
    let coordinates;
    try {
        coordinates = getCoordsForAddress(address)
    } catch (error) {
        return next(error); // Error in coordinate fecthing
    }
    // new place object
    const newPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        image: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Toronto_-_ON_-_Toronto_Harbourfront7.jpg',
        creator
    });
    // fetching user to save the new place attached with the user
    let user;
    try {
        user = await User.findById(creator);
    } catch (error) {
        const fetchError = new HttpError('Failed, Creating place. Try again.', 500);
        return next(fetchError);
    }
    // No user
    if (!user) {
        const notFoundError = new HttpError('Could not find the user with the provided id', 404);
        return next(notFoundError);
    }

    // SAVE code
    try {
        // mongoose session 
        const startSession = await mongoose.startSession();
        startSession.startTransaction();
        await newPlace.save({ session: startSession });
        user.places.push(newPlace);
        await user.save({ session: startSession });
        await startSession.commitTransaction();
    } catch (error) {
        const creationError = new HttpError(
            'Creating place failed, try again.',
            500
        );
        return next(creationError);
    }
    // sending response to the browser
    res.status(201).json({ place: newPlace });
}
//

//
// Update Place
//
const updatePlace = async (req, res, next) => {
    // checking validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationError = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(validationError);
    }
    //
    const { title, description } = req.body;
    const placeID = req.params.pid;
    //
    let place;
    // fetching the document to make the update on it's field
    try {
        place = await Place.findById(placeID)
    } catch (error) {
        const fetchError = new HttpError('Failed, Updating place. Try again.', 500);
        return next(fetchError);
    }
    // assigning values
    place.title = title;
    place.description = description;
    // SAVE - UPDATE the document
    try {
        await place.save();
    } catch (error) {
        const updationError = new HttpError(
            'Updation of the place failed, try again.',
            500
        );
        return next(updationError);
    }
    // sending response to the browser
    res.status(200).json({ place: place.toObject({ getters: true }) });

}
//

//
// Delete the place
//
const deletePlace = async (req, res, next) => {
    const placeID = req.params.pid;
    let place;
    // fetching the document
    try {
        place = await Place.findById(placeID).populate('creator')
    } catch (error) {
        const fetchError = new HttpError('Fetch Failed, Deleting place. Try again.', 500);
        return next(fetchError);
    }
    // not found
    if (!place) {
        const notFoundError = new HttpError('Could not find the place', 404);
        return next(notFoundError);
    }
    // deletion logic
    try {
        // mongoose session 
        const startSession = await mongoose.startSession();
        startSession.startTransaction();
        await place.remove({ session: startSession });
        place.creator.places.pull(place);
        await place.creator.save({ session: startSession });
        await startSession.commitTransaction();
    } catch (error) {
        const deletionError = new HttpError(
            'Deleting place failed, try again.',
            500
        );
        return next(deletionError);
    }
    // sending response to the browser
    res.status(200).json({ message: 'Place Deleted.' });
}


exports.getPlaceById = getPlaceById;
// => exports.anyname = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace; 