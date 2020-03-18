export const start = async (container) => {

  const unsubscribe = listenForData(data => {
    console.log(data)
  })
}


const listenForData = (cb) => {
  const db = firebase.firestore()
  const race = await db.collection('races').doc('VegflgL0UgoDqBOOckN7')

  return race.onSnapshot((doc) => {
    if (doc.exists) {
      cb(doc.data())
    }
  })
}
