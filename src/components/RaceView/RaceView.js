import React, { useState } from 'react'
import classNames from 'classnames'
import ElapsedTime from '../DataFields/ElapsedTime'
import PaceChart from '../PaceChart/PaceChart'
import { LapsTable, MilesTable } from './Tables'
import { metersToMiles, duration, pace } from '../../utils'
import './RaceView.css'


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
      <div>
        Elapsed - <ElapsedTime time={data.start} decimals={2} />
      </div>
      <div>
        Remaining distance - {metersToMiles(data.goal - elapsedDistance).toFixed(2)} miles (X laps)
      </div>
      <div>
        Estimated finish time - <ElapsedTime duration={estimatedFinishTime} /> (approx {estimatedFinishClock})
      </div>
      <div>
        Average pace - <ElapsedTime duration={pace({ duration: elapsedDuration, distance: elapsedDistance })} /> / mile
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
