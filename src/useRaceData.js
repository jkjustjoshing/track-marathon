import { useEffect, useState, useCallback } from 'react'

const db = window.firebase.firestore()
const race = db.collection('races').doc('VegflgL0UgoDqBOOckN7')

const useRaceData = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    return race.onSnapshot(doc => {
      if (doc.exists) {
        setData(doc.data())
      }
    })
  }, [])
  return data
}

export default useRaceData

export const usePushData = () => {
  const data = useRaceData()

  const addLap = useCallback(() => {
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
  }, [data])

  return { addLap }
}
