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


export const usePushData = (id) => {
  const data = useRaceData(id)
  const race = db.collection('races').doc(id)

  const addLap = useCallback(() => {
    const lapStart = data.laps[data.laps.length - 1]?.end || data.start
    race.set({
      ...data,
      laps: [
        ...data.laps,
        {
          start: lapStart,
          end: firebaseDate(),
          distance: 400
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
