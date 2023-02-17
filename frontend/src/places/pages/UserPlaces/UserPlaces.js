import React from 'react'
import { useParams } from 'react-router-dom';
//
//
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'CN Tower Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, Toronto, 5LH0001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'CN Tower',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, Toronto, 5LH0001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
];

//
//
const UserPlaces = () => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
    //
    //
    return (
        <PlaceList items={loadedPlaces} />
    )
}

export default UserPlaces