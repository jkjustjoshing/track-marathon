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
  );
}

export default App;
