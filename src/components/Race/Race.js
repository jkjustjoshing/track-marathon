import React, { useEffect } from 'react';
import Admin from '../Admin/Admin'
import useRaceData, { useFirebaseData } from '../../useRaceData'
import RaceView from '../RaceView/RaceView'
import { useParams, useRouteMatch, Route, Switch, useHistory } from 'react-router-dom'
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
      </Route>
    </Switch>
  );
}

export default Race;

export const RedirectToDefaultRace = () => {
  const data = useFirebaseData('app', 'currentRace')
  const history = useHistory()

  useEffect(() => {
    if (data) {
      history.replace('/' + data.id)
    }
  }, [data, history])
  return null
}
