import React, { useCallback, useState } from 'react'

import { Switch, Route } from 'react-router-dom'
import Users from './user/pages/Users';

//
//
//
const App = () => {
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

      </Switch>
    )
  }
  //
  //
  return (
    <div>App</div>
  )
}

export default App
