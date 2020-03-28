import React from 'react'
import { metersToMiles, laneToDistance } from '../../utils'
import { useRaceContext } from '../../useRaceData'
import ElapsedTime from './ElapsedTime'
export const RemainingDistance = () => {
  const { data, elapsedDistance } = useRaceContext()

  return (
    <div className='race-view__top-data'>
      <div className='race-view__key'>Remaining distance</div>
      <div className='race-view__value'>
        {metersToMiles(data.goal - elapsedDistance).toFixed(2)} miles
        <div className='race-view__sub-data'>
          {((data.goal - elapsedDistance) / laneToDistance(data.currentLane)).toFixed(2)} laps in lane {data.currentLane}
        </div>
      </div>
    </div>
  )
}

export const EstimatedFinishTime = () => {
  const { data, estimatedFinishTime, estimatedFinishClock } = useRaceContext()

  return (
    <div className='race-view__top-data'>
      <div className='race-view__key'>Estimated finish time</div>
      <div className='race-view__value'>
        <ElapsedTime duration={estimatedFinishTime} />
        <div className='race-view__sub-data'>approx {estimatedFinishClock}</div>
      </div>
    </div>
  )
}
