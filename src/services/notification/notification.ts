/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
import * as firebase from 'firebase-admin';

class Notification {
    constructor() {
        firebase.initializeApp({
            credential: firebase.credential.applicationDefault(),
            databaseURL: "",
        });
    }

    async sendNotification(userId: string, uniqueKeys: Array<string>) {
        const n = Math.ceil(uniqueKeys.length / 500);
        for (let i = 0; i < n; i++) {
            firebase.messaging().sendMulticast({
                data: {}, //notification body
                tokens: uniqueKeys.splice((n * 500), 500), // list of tokens
            }).then(response => console.log(response));
        }
    }
}

export default new Notification;