const express = require('express');
const { check } = require('express-validator');
const {
    getPlaceById,
    getPlaceByUserId,
    createPlace,
    updatePlace,
    deletePlace } = require('../controllers/places');

const router = express.Router();

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlaceByUserId);
// place creation route
router.post(
    '/',
    [
        check('title').not().isEmpty(),
        check('description').isLength({ min: 5 }),
        check('address').not().isEmpty()
    ],
    createPlace
);
router.patch('/:pid', updatePlace);
router.delete('/:pid', deletePlace);

module.exports = router;