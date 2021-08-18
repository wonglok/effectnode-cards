const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");

  //
  let db = admin.database();

  let cardID = request.body.cardID;

  if (!cardID) {
  } else {
  }
});

exports.createCard = functions.https.onRequest((request, response) => {
  //
  //
  //
  //
  //
  // ---
  //
  // ---
  //
  // ---
  //
  // ---
  //
  //
  //
  //
  //
  // functions.logger.info("Hello logs!", { structuredData: true });
  //
  // aa
  //
  // functions.logger.info("Hello logs!", { structuredData: true });
  // response.send("Hello from Firebase!");
  // //
  // let db = admin.database();
  // let cardID = request.body.cardID;
  // if (!cardID) {
  // } else {
  // }
  //
  //
});

//
//
//
