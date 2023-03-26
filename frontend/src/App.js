import React, { useCallback, useState } from 'react'

import { Redirect, Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import Users from './user/pages/Users';
import UserPlaces from './places/pages/UserPlaces/UserPlaces';
import NewPlace from './places/pages/NewPlace/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation/MainNavigation';
import { AuthContext } from './shared/context/authContext';

//
//
//
const App = () => {
  //console.log('hi');
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //The React useCallback Hook returns a memoized callback function.
  const login = useCallback(() => {
    setIsLoggedIn(true)
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false)
  }, []);

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route path='/' exact><Users /></Route>
        <Route path="/:userId/places" exact><UserPlaces /></Route>
        <Route path="/places/new" exact><NewPlace /></Route>
        <Route path="/places/:placeId"><UpdatePlace /></Route>
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path='/' exact><Users /></Route>
        <Route path="/:userId/places" exact><UserPlaces /></Route>
        <Route path="/auth"><Auth /></Route>
        <Redirect to="/auth" />
      </Switch>
    )
  }
  //
  //
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>

  )
}

export default App
