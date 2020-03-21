import React from 'react';
import RaceTable from '../RaceTable/RaceTable'
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
        <Route path='/:raceId'>
          <RaceTable />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
