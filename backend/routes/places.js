const express = require('express');

const router = express.Router();

// dummy data
const PLACES = [
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
    }
]

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = PLACES.find(p => {
        return p.id === placeId;
    });
    if(!place) {
        return res.status(404).json({
            message: 'Place not found for the search!',
        })
    }
    res.json({
        place,
    });
});

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const place = PLACES.find(p => {
        return p.creator === userId;
    });
    if(!place) {
        return res.status(404).json({
            message: 'Place not found for the user!',
        })
    }
    res.json({
        place,
    });
})


module.exports = router;