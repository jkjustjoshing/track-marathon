import React, { useState, useReducer } from 'react'
import ReactDOM from 'react-dom'
import { usePushData } from '../../useRaceData'
import useAuth from '../../useAuth'
import './Admin.scss'

const Admin = ({ raceId, data, children }) => {
  const { start, addLap, setLane } = usePushData(raceId)
  const { userId, logout } = useAuth()

  if (!userId) {
    return <Login />
  }

  return (
    <div className='admin'>
      <ConfirmButton onClick={logout}>logout</ConfirmButton>
      <div className='admin__wrapper'>
        <select value={data.currentLane} onChange={e => setLane(e.target.value)}>
          {Array(6).fill(null).map((_, i) => <option key={i} value={i+1}>Lane {i+1}</option>)}
        </select>
        <button onClick={start}>Start</button>
        <button onClick={() => { addLap(data.currentLane) }}>Trigger lap</button>
      </div>
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
