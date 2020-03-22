import React from 'react'
import ElapsedTime from '../DataFields/ElapsedTime'

const RaceTable = ({ data }) => {
  if (!data) {
    return null
  }

  return (
    <>
      Elapsed - <ElapsedTime time={data.start} decimals={2} />
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
            data.laps.map((lap, index) => {
              const duration = lap.end.seconds - lap.start.seconds
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td><ElapsedTime duration={duration} /></td>
                  <td><ElapsedTime duration={(1600 / lap.distance) * duration} /> per mile</td>
                  <td>{JSON.stringify(lap)}</td>
                </tr>
              )
            })
          }
          <tr>
            <td>{data.laps.length + 1}</td>
            <td><ElapsedTime time={data.laps[data.laps.length - 1]?.end || data.start} decimals={2} /></td>
            <td>{data.laps.length}</td>
            <td> - </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default RaceTable
