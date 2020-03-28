import React, { useState } from 'react'
import classNames from 'classnames'
import ElapsedTime from '../DataFields/ElapsedTime'
import PaceChart from '../PaceChart/PaceChart'
import { useRaceContext } from '../../useRaceData'
import { LapsTable, MilesTable } from './Tables'
import { metersToMiles, duration, pace, laneToDistance } from '../../utils'
import './RaceView.scss'


const RaceView = () => {
  const { data, elapsedDistance } = useRaceContext()
  const [reverse, setReverse] = useState(false)

  const elapsedDuration = data.laps[0] ? duration({ start: data.laps[0].start, end: data.laps[data.laps.length - 1].end }) : '-'
  const estimatedFinishTime = elapsedDuration / elapsedDistance * data.goal

  const time = data.laps[0] ? new Date((data.laps[0].start.seconds + estimatedFinishTime) * 1000) : null
  const estimatedFinishClock = time ? time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }) : '-'

  return (
    <>
      <p className='race-view__elapsed'>
        <span className='race-view__elapsed__key'>Race clock</span>
        <ElapsedTime time={data.start} decimals={0} />
      </p>
      <div className='race-view__top'>
        <RemainingDistance />
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

      { data.laps.length && <PaceChart data={data} /> }
      <Tabs tabs={[
        {
          name: 'Laps',
          element: <LapsTable data={data} reverse={reverse} />
        },
        {
          name: 'Miles',
          element: <MilesTable data={data} reverse={reverse} />
        }
      ]} postTabs={
        <button className={classNames('reverse', {
          'reverse--reverse': reverse
        })} onClick={() => setReverse(r => !r)}>
          <div className='reverse__up'>▲</div>
          <div className='reverse__down'>▼</div>
        </button>
      }></Tabs>
    </>
  )
}

export default ({ data }) => {
  const time = data.scheduledStart ? new Date(data.scheduledStart.seconds * 1000) : null
  const estimatedStart = time ? time.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }) : '-'
  return (
    <>
      <div className='race-view-header'>
        <h1 className='sr-only'>Track Marathon</h1>
        <p>One man. One quarantine. One track. One marathon.</p>
        <p className='race-view-header__subtitle'>
          All of my spring races were cancelled. Since I'm all trained up for a marathon, I'm {data && data.start ? 'racing' : 'going to race'} one...by myself, on a 1/4 mile track!
        </p>
      </div>
      <div className='race-view'>
        {data && data.start ? <RaceView /> : (
          <div className='race-view__top'>
            <div className='race-view__top-data'>
              <div className='race-view__key'>Estimated time until start</div>
              <div className='race-view__value'>
                {<ElapsedTime negative time={data.scheduledStart} />}
                <div className='race-view__sub-data'>
                  Planned starting time of {estimatedStart}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

const Tabs = ({ tabs, postTabs, children }) => {
  const [tabIndex, setTabIndex] = useState(0)

  return (
    <div>
      <div className='tabs'>
        {
          tabs.map(({ name }, index) => (
            <button className={classNames('tabs__button', { 'tabs__button--selected': index === tabIndex })} key={index} onClick={() => setTabIndex(index)}>{name}</button>
          ))
        }
        {postTabs}
      </div>
      {children}
      <div className='tabs__panel'>{tabs[tabIndex].element}</div>
    </div>
  )
}

const RemainingDistance = () => {
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
