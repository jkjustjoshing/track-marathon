import React, { useState, useEffect, useMemo, memo } from 'react'

// Make easily overrideable for testing
window.getCurrentDate = () => new Date()

export const secondsToTime = (time, decimals = 0) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor(time / 60 - (hours * 60))
  const seconds = (decimals ? Math.floor : Math.round)(time - (minutes * 60) - (hours * 3600))

  const mult = Math.pow(10, decimals)
  const afterDecimal = Math.floor((time - Math.floor(time)) * mult)

  return [
    hours > 0 ? hours : null,
    minutes,
    seconds
  ]
    .filter(num => typeof num === 'number')
    .map((num, i) => i === 0 ? String(num) : String(num).padStart(2, '0'))
    .join(':') + (decimals ? ('.' + String(afterDecimal).padEnd(decimals, '0')) : '')
}

const StoTCurrent = ({ time, decimals }) => {
  const [currentTime, setCurrentTime] = useState(window.getCurrentDate())

  useEffect(() => {
    let raf
    const updateTime = () => {
      setCurrentTime(window.getCurrentDate())
      raf = requestAnimationFrame(updateTime)
    }

    updateTime()
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [])

  return secondsToTime(((currentTime.getTime() / 1000) - time.seconds), decimals)
}

const ElapsedTime = memo(({ time, duration, decimals = 0 }) => {
  if (typeof duration === 'number') {
    return secondsToTime(duration)
  } else if (time) {
    return <StoTCurrent time={time} decimals={decimals} />
  }
  return 'unknown'
})

export default ElapsedTime
