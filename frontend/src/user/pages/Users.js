import React from 'react';
import UsersList from '../components/UsersList/UsersList';

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'John Doe',
            image:
                'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            places: 3
        },
        {
            id: 'u2',
            name: 'Dan Brown',
            image:
                'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            places: 2
        },
        {
            id: 'u3',
            name: 'Ron Chard',
            image:
                'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
            places: 3
        },

    ];

    return <UsersList items={USERS} />;
};

export default Users;