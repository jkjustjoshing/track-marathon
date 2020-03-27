import React, { useState, useEffect, memo } from 'react'
import { useTimeSync } from '../../timeSync'

const getCurrentTime = (offset) => ((new Date()).getTime() + offset) / 1000

export const secondsToTime = (inputTime, decimals = 0, negative) => {
  let time
  if (negative) {
    time = inputTime < 0 ? (-1 * inputTime) : 0
  } else {
    time = inputTime > 0 ? inputTime : 0
  }
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

const StoTCurrent = ({ time, decimals, negative }) => {
  const offset = useTimeSync()
  const [currentTime, setCurrentTime] = useState(getCurrentTime(offset))

  useEffect(() => {
    let raf
    const updateTime = () => {
      setCurrentTime(getCurrentTime(offset))
      raf = requestAnimationFrame(updateTime)
    }

    updateTime()
    return () => {
      cancelAnimationFrame(raf)
    }
  }, [offset])

  return secondsToTime(((currentTime) - time.seconds), decimals, negative)
}

const ElapsedTime = memo(({ time, duration, decimals = 0, negative }) => {
  if (typeof duration === 'number') {
    return secondsToTime(duration)
  } else if (time) {
    return <StoTCurrent negative={negative} time={time} decimals={decimals} />
  }
  return 'unknown'
})

export default ElapsedTime
