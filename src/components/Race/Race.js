import React, { useEffect } from 'react';
import Admin from '../Admin/Admin'
import useRaceData, { useFirebaseData } from '../../useRaceData'
import ReactTable from '../RaceTable/RaceTable'
import { useParams, useRouteMatch, Route, Switch, useHistory } from 'react-router-dom'
import './Race.css';

const Race = ({ raceId }) => {
  let match = useRouteMatch()
  const { raceId: paramRaceId } = useParams()
  const thisRaceId = paramRaceId || raceId
  const data = useRaceData(thisRaceId)

  return (
    <Switch>
      <Route path={[ `${match.url}/admin`, '/admin' ]}>
        <Admin raceId={thisRaceId} />
        <ReactTable data={data} />
      </Route>
      <Route path={`${match.url}/`}>
        <ReactTable data={data} />
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
      history.push('/' + data.id)
    }
  }, [data, history])
  return null
}
