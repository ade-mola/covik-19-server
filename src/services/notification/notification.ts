/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

class Notification {
    constructor () {

    }

    async sendNotification(userId: string, uniqueKeys: Array<string>) {
        console.log(userId, " => " ,uniqueKeys);
    }
}

export default new Notification;