import React from 'react'
import ElapsedTime from '../DataFields/ElapsedTime'
import { pace, duration, metersToMiles, milesToMeters, laneToDistance, firebaseDate } from '../../utils'
import './Table.scss'

export const LapsTable = ({ data, reverse = false, limit, hideLane = false }) => {

  const currentRow = data.end ? null : (
    <tr className='table__current-row'>
      <td>{data.laps.length + 1}</td>
      <td><ElapsedTime time={data.laps[data.laps.length - 1]?.end || data.start} decimals={1} /></td>
      <td> - </td>
      {hideLane ? null : <td>{data.currentLane} ({laneToDistance(data.currentLane)}m)</td>}
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
          {hideLane ? null : <th>Lane (distance in meters)</th>}
          <th>Total Time</th>
          <th>Total Distance</th>
        </tr>
      </thead>
      <tbody>
        { !reverse && currentRow }
        {
          (reverse ? laps : [...laps].reverse()).filter((_, i) => limit ? i < limit : true).map((lap, index) => {
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
                {hideLane ? null : (
                  <td>
                    {lap.laneNumber} ({lap.distance}m)
                  </td>
                )}
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

const oneMileInMeters = milesToMeters(1)

export const MilesTable = ({ data, reverse = false }) => {

  const miles = data.laps.reduce((acc, nextLap) => {
    if (acc.currentMile.distance + nextLap.distance < oneMileInMeters) {
      // No new mile
      acc.currentMile.distance += nextLap.distance
      acc.currentMile.start = acc.currentMile.start || nextLap.start
    } else {
      const lapDuration = duration(nextLap)
      // Push new mile
      const percentOfLapInMile = (oneMileInMeters - acc.currentMile.distance) / nextLap.distance
      const timeInMile = lapDuration * percentOfLapInMile

      const end = firebaseDate(0, (nextLap.start.seconds + timeInMile) * 1000)
      acc.miles.push({
        start: acc.currentMile.start,
        end: end
      })
      acc.currentMile.distance = nextLap.distance * (1 - percentOfLapInMile)
      acc.currentMile.start = end
    }

    console.log(JSON.parse(JSON.stringify(acc)))
    return acc
  }, { miles: [], currentMile: { distance: 0 } }).miles

  return (
    <table className='table'>
      <thead>
        <tr>
          <th style={{ width: '30px' }}>Mile</th>
          <th>Time (pace)</th>
          <th>Total Time</th>
        </tr>
      </thead>
      <tbody>
        {
          (reverse ? miles : [...miles].reverse()).map((mile, index) => {
            const duration = mile.end.seconds - mile.start.seconds
            const totalDuration = mile.end.seconds - miles[0].start.seconds
            const mileId = reverse ? index + 1 : miles.length - index

            return (
              <tr key={mileId}>
                <td>{mileId}</td>
                <td><ElapsedTime duration={duration} /></td>
                <td><ElapsedTime duration={totalDuration} /></td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

