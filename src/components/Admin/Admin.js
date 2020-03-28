import React, { useState } from 'react'
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
      <div className='admin__content-wrapper'>{children}</div>
      <div className='admin__wrapper'>
        <select value={data.currentLane} onChange={e => setLane(e.target.value)}>
          {Array(6).fill(null).map((_, i) => <option key={i} value={i+1}>Lane {i+1}</option>)}
        </select>
        <button onClick={logout}>logout</button>
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
