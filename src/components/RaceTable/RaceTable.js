import React from 'react'

const secondsToTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.round(time - (minutes * 60))

  return minutes + ':' + String(seconds).padStart(2, '0')
}

const RaceTable = ({ data }) => {
  if (!data) {
    return null
  }

  return (
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
  )
}

export default RaceTable
