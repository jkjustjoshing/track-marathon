const functions = require('firebase-functions');

exports.getServerTime = functions.https.onRequest(async (req, res) => {
  res.json({ time: (new Date().getTime()) });
});
