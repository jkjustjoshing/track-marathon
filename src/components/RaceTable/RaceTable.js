import React from 'react';
import Admin from '../Admin/Admin'
import useRaceData from '../../useRaceData'
import { useParams } from 'react-router-dom'
import './RaceTable.css';

const secondsToTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.round(time - (minutes * 60))

  return minutes + ':' + String(seconds).padStart(2, '0')
}

const RaceTable = () => {
  const { raceId } = useParams()
  const data = useRaceData(raceId)

  console.log(data)

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
    <Admin />
    </>
  );
}

export default RaceTable;
