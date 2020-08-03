/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import UserController from '../../controllers/User';
import ResponseUtility from '../../utilities/Response';
import Logger from '../../utilities/Logger';
import { IUser } from '../../interfaces/User';
import { IHttpResponse } from '../../interfaces/HTTPRepsonse';

// Write Heavy Logic in services
class UserService {
    private userControl: any;

    constructor() {
        this.userControl = UserController
    }

    async sampleRequestHandler(request: Request) {
        try {
            return ResponseUtility.processFailedResponse(404, 'Resource Not Found');
        } catch (e) {
            console.log(`[UserService] inHouseMethod Error: ${e.message}`);
        }
    }

    async updateUserNotificationToken(userId: string, notificationToken: string): Promise<IHttpResponse> {
        if (!userId || !notificationToken) return ResponseUtility.processFailedResponse(400, 'Invalid request data');

        const user = await this.userControl.readOne({ user_id: userId });
        if (!user.success) {
            Logger.info(`User with id: ${userId} does not exit`)
            return ResponseUtility.processFailedResponse(400, 'Invalid user');
        }

        return await this.userControl.update({ user_id: userId }, { ...this.userControl.jsonize(user.payload), notificationToken });
    }
}

export default new UserService; // or new UserService