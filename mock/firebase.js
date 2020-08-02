//
const firebase = require('firebase-admin');
firebase.initializeApp({});

firebase.messaging().sendMulticast({
    notification: {
        title: "Covid 19 tracker.",
        body: "You may have been infected.",
    }, //notification body
    tokens: ['cnD_ckOzdH8:APA91bHq1ekU2cLci5l4ZRYK38AFY6L4EhxfLj3ceA1uYai4FXT54QSWgJIkwk5Ru3C_Xy1nqw_sJcGdKdYDgMrqI4bacJadJq9eMU12xODzviSjGou8Y4_ZNdRvBRU2b0nt1ev7UlJx'], // list of tokens
})
    .then(response => console.log(response))
    .catch(err => console.log(err.message));