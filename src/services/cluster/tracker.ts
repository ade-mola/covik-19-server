/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
import ClusterController from '../../controllers/Cluster';
import UserController from '../../controllers/User';
import NotificationService from '../notification/notification';
import ResponseHelper from '../../utilities/Response';

import { ITestResult } from '../../interfaces/TestResult';
import { IHttpResponse } from '../../interfaces/HTTPRepsonse';
import { ICluster } from '../../interfaces/Cluster';
import { IUser } from '../../interfaces/User';

class Tracker {
    private clusterControl: any;
    private userControl: any;

    constructor() {
        this.clusterControl = ClusterController;
        this.userControl = UserController;
    }

    /**
     * Process test result sent by the test centers.
     * 
     * @param testResult
     */
    async processTestResult(testResult: ITestResult): Promise<IHttpResponse> {
        if (!testResult.userId) return ResponseHelper.processFailedResponse(400, 'Invalid request data');
        if (!testResult.isPositive) return ResponseHelper.processSuccessfulResponse({});

        const { baseTime, currentTime } = this.getTimeRange(testResult.checkInTime);

        const clusters = await this.clusterControl.readMany({
            users: { $in : testResult.userId },
            time: { $range: [ baseTime, currentTime ]}
        });

        if (!clusters.success) {
            console.log(clusters.error.mesage);
            return ResponseHelper.processSuccessfulResponse({});
        }

        const ids: Array<string> = this.extracOtherUserIdsFromClusters(testResult.userId, clusters.payload);
        const users = await this.userControl.readMany({ _id: { $in: [...ids] } });

        if(!users.success) {
            console.log(users.error.message);
            return ResponseHelper.processSuccessfulResponse({});
        }

        const uniqueKeys: Array<string> = users.payload.map( (user: IUser) => user.unique_key);
        await NotificationService.sendNotification(uniqueKeys);

        return ResponseHelper.processSuccessfulResponse({});
    }

    /**
     * Get time range
     * @param checkInTime time the user checks in for the test.
     */
    getTimeRange(checkInTime: string):any {
        const currentTime: number = Date.now();
        const baseTime: number =  Date.parse(checkInTime) - ( 3600 * 24 * 14);

        return { baseTime, currentTime };
    }

    extracOtherUserIdsFromClusters(userId: string, payload: Array<ICluster>): Array<string> {
        let combinedIds: Array<string> = [];
        payload.forEach( cluster => {
            combinedIds = [ ...combinedIds, ...cluster.users]; 
        });

        return combinedIds.filter( id => userId !== id);
    }
}

export default new Tracker;