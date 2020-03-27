import React from 'react';
import Race, { RedirectToDefaultRace } from '../Race/Race'
import { TimeSync } from '../../timeSync'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
// import './App.css';

const App = () => {
  return (
    <TimeSync>
      <Router>
        <Switch>
          <Route exact path='/'>
            <RedirectToDefaultRace />
          </Route>
          <Route path={'/:raceId'} render={({ raceId }) => (
            <Race raceId={raceId} />
          )} />
        </Switch>
      </Router>
    </TimeSync>
  );
}

export default App;
