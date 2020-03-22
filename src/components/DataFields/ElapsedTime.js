import { useState, useEffect } from 'react'

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
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    if (duration) {
      return
    }

    let raf
    const updateTime = () => {
      setCurrentTime(new Date())
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
  }

  return secondsToTime(((currentTime.getTime() / 1000) - time.seconds), decimals)
}

export default ElapsedTime
