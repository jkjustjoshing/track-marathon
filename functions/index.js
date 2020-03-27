const functions = require('firebase-functions');

const whitelist = ['https://track-marathon.kramer.run', 'http://localhost:3000']

exports.getServerTime = functions.https.onRequest(async (req, res) => {
  const origin = req.headers.origin
  if (whitelist.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', whitelist[0])
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.json({ time: (new Date().getTime()) });
});
