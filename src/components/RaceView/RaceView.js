import React, { useState } from 'react'
import ElapsedTime from '../DataFields/ElapsedTime'
import PaceChart from '../PaceChart/PaceChart'
import { LapsTable, MilesTable } from './Tables'
import { metersToMiles } from '../../utils'


const RaceTable = ({ data }) => {
  const [reverse, setReverse] = useState(false)

  return (
    <>
      Elapsed - <ElapsedTime time={data.start} decimals={2} />
      Remaining distance - {metersToMiles(data.goal - data.laps.reduce((meters, { distance }) => meters + distance, 0))}
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
            <button key={index} onClick={() => setTabIndex(index)}>{name}</button>
          ))
        }
      </div>
      {children}
      <div className='tab-panel'>{tabs[tabIndex].element}</div>
    </div>
  )
}
