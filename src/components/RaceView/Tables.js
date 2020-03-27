import React from 'react'
import ElapsedTime from '../DataFields/ElapsedTime'
import { pace, metersToMiles, laneToDistance } from '../../utils'
import './Table.scss'

export const LapsTable = ({ data, reverse = false }) => {

  const currentRow = (
    <tr className='table__current-row'>
      <td>{data.laps.length + 1}</td>
      <td><ElapsedTime time={data.laps[data.laps.length - 1]?.end || data.start} decimals={1} /></td>
      <td> - </td>
      <td>{data.currentLane} ({laneToDistance(data.currentLane)}m)</td>
      <td> - </td>
      <td> - </td>
    </tr>
  )

  const laps = data.laps.reduce((acc, lap) => {
    acc.push({
      ...lap,
      totalDistance: (acc[acc.length - 1] ? acc[acc.length - 1].totalDistance : 0) + lap.distance
    })
    return acc
  }, [])

  return (
    <table className='table'>
      <thead>
        <tr>
          <th>Lap</th>
          <th>Time</th>
          <th>Pace</th>
          <th>Lane (distance in meters)</th>
          <th>Total Time</th>
          <th>Total Distance</th>
        </tr>
      </thead>
      <tbody>
        { !reverse && currentRow }
        {
          (reverse ? laps : [...laps].reverse()).map((lap, index) => {
            const duration = lap.end.seconds - lap.start.seconds
            const totalDuration = lap.end.seconds - laps[0].start.seconds
            const lapId = reverse ? index + 1 : data.laps.length - index

            return (
              <tr key={lapId}>
                <td>{lapId}</td>
                <td><ElapsedTime duration={duration} /></td>
                <td>
                  <ElapsedTime duration={pace({ distance: lap.distance, duration })} /> / mile
                </td>
                <td>
                  {lap.laneNumber} ({lap.distance}m)
                </td>
                <td><ElapsedTime duration={totalDuration} /></td>
                <td>{metersToMiles(lap.totalDistance).toFixed(2)}mi</td>
              </tr>
            )
          })
        }
        { reverse && currentRow }
      </tbody>
    </table>
  )
}

export const MilesTable = ({ data, reverse = false }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Mile</th>
          <th>Approx Mile Pace</th>
          <th>Approx Mile Time</th>
          <th>Approx Elapsed Time</th>
        </tr>
      </thead>
      <tbody>
        {
          [...data.laps].reverse().map((lap, index) => {
            const duration = lap.end.seconds - lap.start.seconds
            return (
              <tr key={index}>
                <td>{data.laps.length - index}</td>
                <td><ElapsedTime duration={duration} /></td>
                <td>
                  <ElapsedTime duration={pace({ distance: lap.distance, duration })} /> per mile
                </td>
                <td>{JSON.stringify(lap)}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}
