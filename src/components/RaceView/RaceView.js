import React, { useState } from 'react'
import classNames from 'classnames'
import ElapsedTime from '../DataFields/ElapsedTime'
import PaceChart from '../PaceChart/PaceChart'
import { LapsTable, MilesTable } from './Tables'
import { metersToMiles, duration, pace } from '../../utils'
import { getDistance } from '../../useRaceData'
import './RaceView.scss'


const RaceTable = ({ data }) => {
  const [reverse, setReverse] = useState(false)

  const elapsedDistance = data.laps.reduce((meters, { distance }) => meters + distance, 0)
  const elapsedDuration = duration({ start: data.laps[0].start, end: data.laps[data.laps.length - 1].end })
  const estimatedFinishTime = elapsedDuration / elapsedDistance * data.goal

  const time = new Date((data.laps[0].start.seconds + estimatedFinishTime) * 1000)

  const estimatedFinishClock = time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  })

  return (
    <>
      <div className='race-view-header'>
        <h1 className='sr-only'>Track Marathon</h1>
        <p>One man. One quarantine. One track. One marathon.</p>
      </div>
      <div className='race-view'>

        <p className='race-view__elapsed'>
          <div className='race-view__elapsed__key'>Race clock</div>
          <ElapsedTime time={data.start} decimals={0} />
        </p>
        <div className='race-view__top'>
          <div className='race-view__top-data'>
            <div className='race-view__key'>Remaining distance</div>
            <div className='race-view__value'>
              {metersToMiles(data.goal - elapsedDistance).toFixed(2)} miles
              <div className='race-view__sub-data'>
                {((data.goal - elapsedDistance) / getDistance(data.currentLane)).toFixed(2)} laps in lane {data.currentLane}
              </div>
            </div>
          </div>
          <div className='race-view__top-data'>
            <div className='race-view__key'>Estimated finish time</div>
            <div className='race-view__value'>
              <ElapsedTime duration={estimatedFinishTime} />
              <div className='race-view__sub-data'>approx {estimatedFinishClock}</div>
            </div>
          </div>
          <div className='race-view__top-data'>
            <div className='race-view__key'>Average pace</div>
            <div className='race-view__value'><ElapsedTime duration={pace({ duration: elapsedDuration, distance: elapsedDistance })} /> / mile</div>
          </div>
          <div className='race-view__top-data'>
            <div className='race-view__key'>Josh is currently running in lane</div>
            <div className='race-view__value'>{data.currentLane}</div>
          </div>
        </div>

        <PaceChart data={data} />
        <Tabs tabs={[
          {
            name: 'Laps',
            element: <LapsTable data={data} reverse={reverse} />
          },
          {
            name: 'Miles',
            element: <MilesTable data={data} reverse={reverse} />
          }
        ]}>
          <button onClick={() => setReverse(r => !r)}>Reverse</button>
        </Tabs>
      </div>
    </>
  )
}

export default RaceTable

const Tabs = ({ tabs, children }) => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div>
      <div className='tabs'>
        {
          tabs.map(({ name }, index) => (
            <button className={classNames('tabs__button', { 'tabs__button--selected': index === tabIndex })} key={index} onClick={() => setTabIndex(index)}>{name}</button>
          ))
        }
      </div>
      {children}
      <div className='tabs__panel'>{tabs[tabIndex].element}</div>
    </div>
  )
}
