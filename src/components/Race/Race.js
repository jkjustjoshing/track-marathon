import React from 'react';
import Admin from '../Admin/Admin'
import useRaceData, { useFirebaseData, RaceContextProvider } from '../../useRaceData'
import RaceView from '../RaceView/RaceView'
import { useParams, useRouteMatch, Route, Switch, Link } from 'react-router-dom'
import './Race.css';

const Race = ({ raceId }) => {
  let match = useRouteMatch()
  const { raceId: paramRaceId } = useParams()
  const thisRaceId = paramRaceId || raceId
  const data = useRaceData(thisRaceId)

  return data && (
    <RaceContextProvider data={data}>
      <Switch>
        <Route path={[ `${match.url}/admin`, '/admin' ]}>
          <Admin raceId={thisRaceId} />
        </Route>
        <Route path={`${match.url}/`}>
          <RaceView />
          <Link to={`${thisRaceId}/admin`}>Admin</Link>
        </Route>
      </Switch>
    </RaceContextProvider>
  );
}

export default Race;

export const RedirectToDefaultRace = () => {
  const data = useFirebaseData('app', 'currentRace')
  return data && <Race raceId={data.id} />
}
