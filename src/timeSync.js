import React, { createContext, useContext, useState, useEffect } from 'react'

// const URL = 'http://localhost:4444/track-marathon/us-central1/getServerTime'
const URL = 'https://us-central1-track-marathon.cloudfunctions.net/getServerTime'

const context = createContext(null)

export const TimeSync = ({ children }) => {
  const [offset, setOffset] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTimeSync().then(setOffset).catch(setError)
  }, [])

  if (error) {
    console.log(error)
    return 'There was an error. Please refresh the page. If you have a content blocker like uMatrix, make sure it allows all network requests.'
  }
  if (!offset) {
    return 'Loading...'
  }
  return (
    <context.Provider value={offset}>
      {children}
    </context.Provider>
  )
}

export const useTimeSync = () => useContext(context)


const getTimeSync = async () => {
  if (typeof window === 'undefined') {
    return
  }
  const response = await window.fetch(URL)
  const json = await response.json()
  return json.time - ((new Date()).getTime())
}
