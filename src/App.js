import React, { useEffect } from 'react';
import './App.css';

export const start = () => {


  const unsubscribe = listenForData(data => {
    console.log(data)
  })
}


const listenForData = (cb) => {
  const db = window.firebase.firestore()
  const race = db.collection('races').doc('VegflgL0UgoDqBOOckN7')

  return race.onSnapshot((doc) => {
    if (doc.exists) {
      cb(doc.data())
    }
  })
}


const App = () => {

  useEffect(() => {
    start()
  }, [])

  return (
    <table id='lap-table'>
      <tr>
        <th>Lap</th>
        <th>Time</th>
        <th>Pace</th>
      </tr>
    </table>
  );
}

export default App;
