import { useEffect, useState, useCallback } from 'react'

const db = window.firebase.firestore()

const useRaceData = (id) => useFirebaseData('races', id)

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

export default useRaceData

export const usePushData = (id) => {
  const data = useRaceData(id)

  const addLap = useCallback(() => {
    const race = db.collection('races').doc(id)

    console.log(id, race)

    race.set({
      ...data,
      laps: [
        ...data.laps,
        {
          start: data.laps[data.laps.length - 1].end,
          end: window.firebase.firestore.Timestamp.fromDate(new Date()),
          distance: 400
        }
      ]
    })
  }, [id, data])

  return { addLap }
}
