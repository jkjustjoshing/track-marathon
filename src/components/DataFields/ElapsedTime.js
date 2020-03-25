import { useState, useEffect } from 'react'

// Make easily overrideable for testing
window.getCurrentDate = () => new Date()

const secondsToTime = (time, decimals = 0) => {
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
    .map(num => String(num).padStart(2, '0'))
    .join(':') + (decimals ? ('.' + String(afterDecimal).padEnd(decimals, '0')) : '')
}

const ElapsedTime = ({ time, duration, decimals = 0 }) => {
  const [currentTime, setCurrentTime] = useState(window.getCurrentDate())

  useEffect(() => {
    if (duration) {
      return
    }

    let raf
    const updateTime = () => {
      setCurrentTime(window.getCurrentDate())
      // for(let i = 0; i < 300000000; i++) {}
      raf = requestAnimationFrame(updateTime)
    }

    updateTime()
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [duration])

  if (duration) {
    return secondsToTime(duration)
  } else if (time) {
    return secondsToTime(((currentTime.getTime() / 1000) - time.seconds), decimals)
  }
  return 'unknown'

}

export default ElapsedTime
