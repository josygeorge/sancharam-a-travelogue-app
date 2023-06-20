const express = require('express');
const { check } = require('express-validator');
const {
    getPlaceById,
    getPlaceByUserId,
    createPlace,
    updatePlace,
    deletePlace } = require('../controllers/places');

const router = express.Router();
// route - get place by id - all users
router.get('/:pid', getPlaceById);
// get place in a particular user
router.get('/user/:uid', getPlaceByUserId);
// route for place creation 
router.post(
    '/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 10 }),
        check('address').not().isEmpty()
    ],
    createPlace
);
// route - update place
router.patch(
    '/:pid',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 10 })
    ],
    updatePlace
);
// route - delete place
router.delete('/:pid', deletePlace);

module.exports = router;