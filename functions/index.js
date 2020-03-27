const functions = require('firebase-functions');

const whitelist = ['https://track-marathon.kramer.run', 'http://localhost:3000']

exports.getServerTime = functions.https.onRequest(async (req, res) => {
  const origin = req.headers.origin
  if (whitelist.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.json({ time: (new Date().getTime()) });
});
