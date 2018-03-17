const functions = require('firebase-functions');
const admin = require('firebase-admin');
const webpush = require('web-push');
const cors = require('cors')({
  origin: true
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const serviceAccount = require("./note-pwa-packtpub-firebase-adminsdk-y13zc-a1aa90173b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://note-pwa-packtpub.firebaseio.com"
});

exports.saveNote = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('notes').push({
        id: request.body.id,
        title: request.body.title,
        note: request.body.note,
        date: request.body.date,
        synced: true,
      })
      .then(function () {
        webpush.setVapidDetails(
          'mailto:me@majidhajian.com',
          'BM7PSyvdfXZUFZD47E3zPqDqw-INAQiy9hnKxJYramR76iJc2Onkf2wbKZBJ4SRJhMA7zehnyGV45Joauo__lhs',
          '0FRoGdIaQvNcTbgvnVGoaUVXzh8Fr01b4DQ2kLdZH3c'
        );
        return admin.database().ref('subscriptions').once('value');
      })
      .then(subscriptions => {
        subscriptions.forEach((sub) => {
          var subID = sub.key;
          var pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          };
          webpush.sendNotification(pushConfig, JSON.stringify({
              title: 'New Note',
              content: `Note ${request.body.id} has been synced!`,
            }))
            .catch(err => {
              // Check for "410 - Gone" status and delete it
              if (err.statusCode === 410) {
                admin.database()
                  .ref('subscriptions/' + subID)
                  .remove()
                  .then(() => console.log(subID + 'has been deleted!'));
              }
            });
        });
        response.status(201).json({
          message: 'Note saved!',
          id: request.body.id
        });
      })
      .catch((err) => response.status(500).json({
        error: err,
        id: request.body.id,
      }));
  });
});

exports.deleteNote = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('notes/' + request.body.id)
      .remove()
      .then(() => response.status(200).json({
        message: 'Note deleted!',
        id: request.body.id
      }))
      .catch((err) => response.status(500).json({
        error: err,
        id: request.body.id,
      }));
  });
});

exports.saveSubscription = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('subscriptions').push(request.body)
      .then(() => response.status(201).json({
        message: 'Subscription granted!',
        id: request.body.id
      }))
      .catch((err) => response.status(500).json({
        error: err,
        id: request.body.id,
      }));
  });
});
