import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

const useRaceData = () => {
  const race = useMemo(() => {
    const db = window.firebase.firestore()
    return db.collection('races').doc('VegflgL0UgoDqBOOckN7')
  }, [])
  const [data, setData] = useState(null)
  useEffect(() => {
    return race.onSnapshot(doc => {
      if (doc.exists) {
        setData(doc.data())
      }
    })
  }, [race])
  return data
}

const secondsToTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.round(time - (minutes * 60))

  return minutes + ':' + String(seconds).padStart(2, '0')
}

const App = () => {


  const data = useRaceData()

  console.log(data)

  return data && (
    <table id='lap-table'>
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
          data.laps.map((lap, id) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{secondsToTime(lap.duration)}</td>
              <td>{secondsToTime((1600 / lap.distance) * lap.duration)} per mile</td>
              <td>{JSON.stringify(lap)}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default App;
