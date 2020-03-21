import React from 'react';
import Admin from '../Admin/Admin'
import useRaceData, { useFirebaseData } from '../../useRaceData'
import { useParams } from 'react-router-dom'
import './RaceTable.css';

const secondsToTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.round(time - (minutes * 60))

  return minutes + ':' + String(seconds).padStart(2, '0')
}

const RaceTable = ({ raceId }) => {
  const { raceId: paramRaceId } = useParams()
  const thisRaceId = paramRaceId || raceId
  const data = useRaceData(thisRaceId)

  return data && (
    <><table id='lap-table'>
      <thead>
        <tr>
          <th>Lap</th>
          <th>Time</th>
          <th>Pace</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          data.laps.map((lap, id) => {
            const duration = lap.end - lap.start
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{secondsToTime(duration)}</td>
                <td>{secondsToTime((1600 / lap.distance) * duration)} per mile</td>
                <td>{JSON.stringify(lap)}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
    <Admin raceId={thisRaceId} />
    </>
  );
}

export default RaceTable;

export const DefaultRaceTable = () => {
  const data = useFirebaseData('app', 'currentRace')
  if (!data) {
    return null
  }
  return data.id ? <RaceTable raceId={data.id} /> : null
}
