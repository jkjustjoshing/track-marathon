import React from 'react';
import Admin from '../Admin/Admin'
import useRaceData, { useFirebaseData } from '../../useRaceData'
import RaceView from '../RaceView/RaceView'
import { useParams, useRouteMatch, Route, Switch, Link } from 'react-router-dom'
import './Race.css';

const Race = ({ raceId }) => {
  let match = useRouteMatch()
  const { raceId: paramRaceId } = useParams()
  const thisRaceId = paramRaceId || raceId
  const data = useRaceData(thisRaceId)

  return data && (
    <Switch>
      <Route path={[ `${match.url}/admin`, '/admin' ]}>
        <Admin raceId={thisRaceId} data={data}>
          <RaceView data={data} />
        </Admin>
      </Route>
      <Route path={`${match.url}/`}>
        <RaceView data={data} />
        <Link to={`/${raceId}/admin`}>Admin</Link>
      </Route>
    </Switch>
  );
}

export default Race;

export const RedirectToDefaultRace = () => {
  const data = useFirebaseData('app', 'currentRace')
  return data && <Race raceId={data.id} />
}
