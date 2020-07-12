/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
import ClusterController from '../../controllers/Cluster';
import UserController from '../../controllers/User';
import NotificationService from '../notification/notification';
import ResponseHelper from '../../utilities/Response';

import { ITestResult } from '../../interfaces/TestResult';
import { IHttpResponse } from '../../interfaces/HTTPRepsonse';
import { ICluster, IClusterInfo } from '../../interfaces/Cluster';
import { IUser } from '../../interfaces/User';
import Logger from '../../utilities/Logger';

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
        const { userId, isPositive, checkInTime } = testResult;
        if (!userId) return ResponseHelper.processFailedResponse(400, 'Invalid request data');
        if (!isPositive) return ResponseHelper.processSuccessfulResponse({});

        const userDbKey = `users.${userId}`;
        const clusters = await this.clusterControl.readMany({
            [userDbKey]: { $exists: true }
        });

        if (!clusters.success) {
            Logger.error(clusters.error.mesage);
            return ResponseHelper.processFailedResponse(500, 'Something went wrong while processing test result');
        }

        const ids: Array<string> = this.extracOtherUserIdsFromClusters(userId, checkInTime, clusters.payload);
        const users = await this.userControl.readMany({ user_id: { $in: [...ids] } });

        if (!users.success) {
            Logger.error(users.error.message);
            return ResponseHelper.processSuccessfulResponse({});
        }

        const uniqueKeys: Array<string> = users.payload.map((user: IUser) => user.user_id);
        await NotificationService.sendNotification(userId, uniqueKeys);

        Logger.info(`Notification was sent to users: ${uniqueKeys}`)
        return ResponseHelper.processSuccessfulResponse({});
    }

    /**
     * 
     * @param clusterInfo 
     */
    async createorUpdateCluster(clusterInfo: IClusterInfo): Promise<IHttpResponse> {

        const { userId, time, location } = clusterInfo;
        if (!userId || !time || !location) return ResponseHelper.processFailedResponse(400, 'Invalid request data');

        const user = await this.userControl.readOne({ user_id: userId })
        if (!user.success) {
            Logger.info(`User with id: ${userId} does not exit`)
            return ResponseHelper.processFailedResponse(400, 'Invalid user');
        }

        const { longitude, latitude } = this.splitLocationData(location);

        const responseFromClusterQuery = await this.findClusterWithLocation(longitude, latitude);

        if (responseFromClusterQuery.success) {
            const cluster = responseFromClusterQuery.payload;
            if(cluster.users[userId]) {
                Logger.info(`User ${userId} already exist in this same location lonitude:${longitude}, latitude:${latitude}. Updating their time_left`)
                const update = `users.${userId}.time_left`
                await cluster.updateOne({ '$set': { [update]: new Date(time)}});
                return ResponseHelper.processSuccessfulResponse('1 cluster updated');
            }
        }

        const { baseTime, currentTime } = this.getTimeRange(time, 5);

        if (new Date(Date.parse(time)) > currentTime) return ResponseHelper.processFailedResponse(400, 'Invalid date');

        if (!longitude || !latitude) return ResponseHelper.processFailedResponse(400, 'Invalid formatted location data');

        const response = await this.clusterControl.readMany({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 3, //within 3m
                    $minDistance: 0
                }
            }
        });

        if (response.success) {
            //update those clusters
            Logger.info(`Found a valid existing cluster. adding user id ${userId} to the cluster`);
            const clusters = response.payload as Array<any>
            clusters.forEach(cluster => this.updateCluster(userId, time, cluster))
            return ResponseHelper.processSuccessfulResponse(`${clusters.length} clusters updated`);
        }

        return await this.createCluster(longitude, latitude, time, userId);
    }

    async findClusterWithLocation(longitude: number, latitude:number): Promise<IHttpResponse> {
        
        const response = await this.clusterControl.readOne({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 3, //within 3m
                    $minDistance: 0
                }
            }
        });
        return response;
    }
    async createCluster(longitude: number, latitude: number, time: string, userId: string): Promise<IHttpResponse> {

        const newCluster: ICluster = {
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            users: {
                [userId]: {
                    time_joined: new Date(time),
                    time_left: new Date(time)
                }
            }
        }

        const cluster = await this.clusterControl.create(newCluster)

        if (!cluster.success) {
            Logger.error(cluster.error.message);
            return ResponseHelper.processFailedResponse(500, 'Something went wrong while trying to create new cluster');
        }

        Logger.info(`New cluster created for user ID: ${userId}`, newCluster)
        return ResponseHelper.processSuccessfulResponse({ ...newCluster });
    }

    async updateCluster(userId: string, time:string, cluster: any) {
        const details = {
            time_joined: new Date(time),
            time_left: new Date(time)
        }
        const update = `users.${userId}`
        await cluster.updateOne({ '$set': { [update]: details } });
    }

    /**
     * Get time range
     * @param checkInTime time the user checks in for the test.
     */
    getTimeRange(checkInTime: string, days: number): any {
        const currentTime: Date = new Date(Date.now());
        const baseTime: Date = new Date(Date.parse(checkInTime) - (days * 3600 * 24 * 1000));

        return { baseTime, currentTime };
    }

    extracOtherUserIdsFromClusters(userId: string, checkInTime: string, payload: Array<ICluster>): Array<string> {
        const { baseTime } = this.getTimeRange(checkInTime, 14);
        let combinedIds: Array<string> = [];
        payload.forEach(cluster => {
            const { time_joined } = cluster.users[userId];
            for (let id in cluster.users) {
                const clusterUser = cluster.users[id];
                if (time_joined < baseTime) continue;
                if (clusterUser.time_joined < time_joined && clusterUser.time_left < time_joined) continue;
                if (id == userId) continue;

                //
                combinedIds.push(id);
            }
        });

        return combinedIds;
    }

    splitLocationData(location: string): any {
        const locationArr: string[] = location.split(':', 2);
        const longitude = parseFloat(locationArr[0]);
        const latitude = parseFloat(locationArr[1]);

        return { longitude, latitude };
    }
}

export default new Tracker;