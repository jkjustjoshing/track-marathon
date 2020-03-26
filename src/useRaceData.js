import { useEffect, useState, useCallback } from 'react'

const firebaseDate = (date) => {
  // When passing undefined, args.length should equal 0
  const dateObj = new Date(...([date].filter(Boolean)))
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

const getDistance = (laneNumber) => ({
  1: 400,
  2: 407,
  3: 415,
  4: 423,
  5: 430,
  6: 433,
  7: 446,
  8: 453
}[laneNumber] || 400)

// const now = (new Date()).getTime()
// const random10 = () => Math.round((Math.random() * 4) - 2)
// const randomLaps = Array(23).fill(null).reduce((acc, _, i) => [ ...acc, {
//   start: acc[acc.length - 1] ? acc[acc.length - 1].end : firebaseDate(now + (((i * 60 * 2) + random10()) * 1000)),
//   end: firebaseDate(now + ((((i + 1) * 60 * 2) + random10()) * 1000)),
//   distance: 410 + random10()
// }], [])

export const usePushData = (id) => {
  const data = useRaceData(id)
  const race = db.collection('races').doc(id)

  const addLap = useCallback((laneNumber = 1) => {
    const lapStart = data.laps[data.laps.length - 1]?.end || data.start
    race.set({
      ...data,
      laps: [
        ...data.laps,
        {
          start: lapStart,
          end: firebaseDate(),
          distance: getDistance(laneNumber),
          laneNumber
        }
      ]
    })
  }, [race, data])

  const start = useCallback(() => {
    race.set({
      ...data,
      start: firebaseDate(),
      laps: []
    })
  }, [race, data])

  return { start, addLap }
}
