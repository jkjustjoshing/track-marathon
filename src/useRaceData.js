import { useEffect, useState, useCallback } from 'react'

const getRace = (id) => {
  const db = window.firebase.firestore()
  return db.collection('races').doc(id)
}

const useRaceData = (id) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const race = getRace(id)
    return race.onSnapshot(doc => {
      if (doc.exists) {
        setData(doc.data())
      }
    })
  }, [id])
  return data
}

export default useRaceData

export const usePushData = (id) => {
  const data = useRaceData(id)

  const addLap = useCallback(() => {
    const race = getRace(id)

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
