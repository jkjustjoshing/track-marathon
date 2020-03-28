import React, { useState } from 'react'
import classNames from 'classnames'
import ElapsedTime from '../DataFields/ElapsedTime'
import PaceChart from '../PaceChart/PaceChart'
import { useRaceContext } from '../../useRaceData'
import { LapsTable, MilesTable } from './Tables'
import { RemainingDistance, EstimatedFinishTime } from '../DataFields'
import { pace } from '../../utils'
import './RaceView.scss'


const RaceView = () => {
  const { data, elapsedDistance, elapsedDuration } = useRaceContext()
  const [reverse, setReverse] = useState(false)

  return (
    <>
      <p className='race-view__elapsed'>
        <span className='race-view__elapsed__key'>Race clock</span>
        <ElapsedTime time={data.start} decimals={0} />
      </p>
      <div className='race-view__top'>
        <RemainingDistance />
        <EstimatedFinishTime />
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

export default () => {
  const { data } = useRaceContext()
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
