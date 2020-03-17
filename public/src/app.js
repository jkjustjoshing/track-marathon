console.log('foo')

export const start = () => {
  const db = firebase.firestore()
  db.collection('races').get().then(querySnapshot => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data())
    })
  })
}
