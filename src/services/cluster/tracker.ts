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

        const { baseTime, currentTime } = this.getTimeRange(checkInTime, 14);

        const clusters = await this.clusterControl.readMany({
            users: { $in: [userId] },
            time: { $gte: baseTime, $lte: currentTime }
        });

        if (!clusters.success) {
            Logger.error(clusters.error.mesage);
            return ResponseHelper.processFailedResponse(500, 'Something went wrong while processing test result');
        }

        const ids: Array<string> = this.extracOtherUserIdsFromClusters(userId, clusters.payload);
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

        const responseFromClusterQuery = await this.findCluseterWithLocation(longitude, longitude);
        if (responseFromClusterQuery.success) {
            const cluster = responseFromClusterQuery.payload;
            const user = cluster.users.get(userId)
            if(user) {
                Logger.info(`User ${userId} already exist in this same location lonitude:${longitude}, latitude:${latitude}. Updating their time_left`)
                user.set("time_left", new Date(time))
                await cluster.save();
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
            },
            time: { $gte: baseTime, $lte: currentTime }
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

    async findCluseterWithLocation(longitude:number, latitude:number): Promise<IHttpResponse> {

        //should find an exact same location
        const response = await this.clusterControl.readOne({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 0, 
                    $minDistance: 0
                }
            },
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
                userId: {
                    "time_joined": new Date(time),
                    "time_left": new Date(time)
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
        cluster.users.set(userId, details)
        await cluster.save();
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

    extracOtherUserIdsFromClusters(userId: string, payload: Array<ICluster>): Array<string> {
        TODO: ' Change this from Array extraction to object extraction';
        let combinedIds: Array<string> = [];
        payload.forEach(cluster => {
            combinedIds = [...combinedIds, ...cluster.users];
        });

        return combinedIds.filter(id => userId !== id);
    }

    splitLocationData(location: string): any {
        const locationArr: string[] = location.split(':', 2);
        const longitude = parseFloat(locationArr[0]);
        const latitude = parseFloat(locationArr[1]);

        return { longitude, latitude };
    }
}

export default new Tracker;