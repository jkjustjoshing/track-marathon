import { useEffect, useState, useCallback } from 'react'
import { useTimeSync } from './timeSync'

const firebaseDate = (offset, date) => {
  // When passing undefined, args.length should equal 0
  const dateObj = new Date(...([date].filter(Boolean)))
  dateObj.setTime(dateObj.getTime() + offset)
  return window.firebase.firestore.Timestamp.fromDate(dateObj)
}

const db = window.firebase.firestore()

const useRaceData = (id) => useFirebaseData('races', id)
export default useRaceData

export const useFirebaseData = (collection, id) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const item = db.collection(collection).doc(id)

    return item.onSnapshot(doc => {
      if (doc.exists) {
        setData(doc.data())
      }
    })
  }, [collection, id])
  return data
}

export const getDistance = (laneNumber) => ({
  1: 400,
  2: 407,
  3: 415,
  4: 423,
  5: 430,
  6: 433,
  7: 446,
  8: 453
}[laneNumber] || 400)

const generateData = (race, data) => { // eslint-disable-line
  const now = (new Date()).getTime()
  const random10 = () => Math.round((Math.random() * 4) - 2)
  const randomLaps = Array(80).fill(null).reduce((acc, _, i) => [ {
    start: firebaseDate(0, now - ((((i + 1) * 60 * 2) + random10()) * 1000)),
    end: acc[0] ? acc[0].start : firebaseDate(0),
    distance: 410 + random10(),
    laneNumber: random10() + 3
  }, ...acc], [])
  race.set({
    ...data,
    start: randomLaps[0].start,
    laps: randomLaps
  })
}

export const usePushData = (id) => {
  const data = useRaceData(id)
  const offset = useTimeSync()
  const race = db.collection('races').doc(id)

  const addLap = useCallback((laneNumber = 1) => {
    // return generateData(race, data)
    const lapStart = data.laps[data.laps.length - 1]?.end || data.start
    race.set({
      ...data,
      laps: [
        ...data.laps,
        {
          start: lapStart,
          end: firebaseDate(offset),
          distance: getDistance(laneNumber),
          laneNumber
        }
      ]
    })
  }, [race, data, offset])

  const start = useCallback(() => {
    race.set({
      ...data,
      start: firebaseDate(offset),
      laps: []
    })
  }, [race, data, offset])

  const setLane = useCallback((nextLane) => {
    race.set({
      ...data,
      currentLane: nextLane
    })
  }, [race, data])

  return { start, addLap, setLane }
}
