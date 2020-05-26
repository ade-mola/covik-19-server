/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import UserController from '../../controllers/User';
import ResponseUtility from '../../utilities/Response';
import { IHttpResponse } from '../../interfaces/HTTPRepsonse';

// Write Heavy Logic in services
class UserService {
    constructor() { }

    async sampleRequestHandler(request: Request) {
        try {
            return ResponseUtility.processFailedResponse(404, 'Resource Not Found');
        } catch (e) {
            console.log(`[UserService] inHouseMethod Error: ${e.message}`);
        }
    }
}

export default UserService; // or new UserService