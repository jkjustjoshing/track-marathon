import React, { useState, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { LapsTable } from '../RaceView/Tables'
import { RemainingDistance } from '../DataFields'
import { usePushData, useRaceContext } from '../../useRaceData'
import { laneToDistance } from '../../utils'
import useAuth from '../../useAuth'
import './Admin.scss'

const Admin = ({ raceId }) => {
  const { data, elapsedDistance } = useRaceContext()
  const { start, addLap, setLane, removeLap, end, unEnd } = usePushData(raceId)
  const { userId, logout } = useAuth()

  if (!userId) {
    return <Login />
  }

  const remainingDistance = data.goal - elapsedDistance
  const showEnd = remainingDistance < laneToDistance(data.currentLane)

  const started = Boolean(data.start)

  return (
    <div className='admin'>
      <ConfirmButton onClick={logout}>logout</ConfirmButton>
      <RemainingDistance />
      <select className='admin__select' value={data.currentLane} onChange={e => setLane(e.target.value)}>
        {Array(6).fill(null).map((_, i) => <option key={i} value={i+1}>Lane {i+1}</option>)}
      </select>
      <div className='admin__wrapper'>
        {!data.end && (
          <>
            {!started && <button onClick={start}>Start</button>}

            {started && !showEnd && <button onClick={() => { addLap(data.currentLane) }}>Trigger lap</button>}
            {showEnd && <button onClick={() => end(remainingDistance)}>Finish</button>}
            {Boolean(data.laps.length) && <button onClick={() => { removeLap() }}>Undo last lap</button>}
          </>
        )}
        {
          data.end && (
            <ConfirmButton onClick={unEnd}>Reverse end</ConfirmButton>
          )
        }
      </div>
      <LapsTable data={data} limit={5} hideLane />
    </div>
  )
}

export default Admin

const Login = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form className='login' onSubmit={e => {
      e.preventDefault()
      login(email, password)
    }}>
      <input placeholder='email' onChange={e => setEmail(e.target.value)} value={email} />
      <input type='password' placeholder='password' onChange={e => setPassword(e.target.value)} value={password} />
      <button type='submit'>Login</button>
    </form>
  )
}

const ConfirmButton = ({ onClick, ...props }) => {

  const [state, dispatch] = useReducer((state, { action, event }) => {
    if (action === 'click') {
      event.preventDefault()
      return { state: 'show_overlay', event: event }
    } else if (action === 'confirm') {
      onClick && onClick(state.event)
      return { state: 'base'}
    } else if (action === 'cancel') {
      return { state: 'base' }
    }
  }, { state: 'base' })

  const initClick = (event) => {
    event.persist()
    dispatch({ action: 'click', event })
  }

  return (
    <>
      <button onClick={initClick} {...props} />
      {
        state.state === 'show_overlay' && ReactDOM.createPortal(
          (
            <div className='popup'>
              <button onClick={() => dispatch({ action: 'confirm' })} style={{ background: 'green' }}>Confirm</button>
              <button onClick={() => dispatch({ action: 'cancel' })} style={{ background: 'red' }}>Cancel</button>
            </div>
          ),
          document.getElementById('popup')
        )
      }
    </>
  )
}
