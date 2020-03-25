import React, { useState } from 'react'
import { usePushData } from '../../useRaceData'
import useAuth from '../../useAuth'
import './Admin.css'

const Admin = ({ raceId, children }) => {
  const { start, addLap } = usePushData(raceId)
  const { userId, logout } = useAuth()

  if (!userId) {
    return <Login />
  }

  return (
    <div className='admin'>
      <div className='admin__content-wrapper'>{children}</div>
      <div className='admin__wrapper'>
        <button onClick={logout}>logout</button>
        <button onClick={start}>Start</button>
        <button onClick={addLap}>Trigger lap</button>
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
    <form onSubmit={e => {
      e.preventDefault()
      login(email, password)
    }}>
      <input placeholder='email' onChange={e => setEmail(e.target.value)} value={email} />
      <input type='password' placeholder='password' onChange={e => setPassword(e.target.value)} value={password} />
      <button type='submit'>Login</button>
    </form>
  )
}
