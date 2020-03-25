import React from 'react';
import Race, { RedirectToDefaultRace } from '../Race/Race'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
// import './App.css';

const App = () => {

  return (
    <>
      <h1>Track Marathon</h1>
      <p>One man. One quarantine. One track. One marathon.</p>
      <Router>
        <Switch>
          <Route path='/:raceId' render={({ raceId }) => (
            <Race raceId={raceId} />
          )} />
          <Route path='/'>
            <RedirectToDefaultRace />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
