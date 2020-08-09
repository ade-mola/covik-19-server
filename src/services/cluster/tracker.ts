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
import Logger from '../../utilities/Logger';

import InfectionTracker from '../patient-tracking/patient-clusters';

var clusterQueue: Array<IClusterInfo> = []

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

        const { baseTime } = this.getTimeRange(checkInTime, 14);

        const infectionTracker = new InfectionTracker(userId);
        await infectionTracker.getListOfPossibleCasesForGivenUser(userId, baseTime, true);

        let cases: Array<any> = [];
        infectionTracker.possibleCases.forEach((v, k) => cases.push(k));

        const infectedUsers = await UserController.readMany({ user_id: cases.join() });
        const tokens = infectedUsers.payload.map((e: any) => e.token);
        NotificationService.sendNotification(userId, tokens);

        return ResponseHelper.processSuccessfulResponse({
            userId,
            cases,
        });
    }


    async addAndProcessClusterQueue(clusters: Array<IClusterInfo>): Promise<IHttpResponse> {
        clusterQueue.push(...clusters);
        this.processClusterQueue()
        return ResponseHelper.processSuccessfulResponse("request sucessfully enqueued to be processed");
    }

    async processClusterQueue() {
        while (clusterQueue.length) {
            this.createorUpdateCluster(clusterQueue.shift() as IClusterInfo)
        }
    }

    /**
    * Process test result sent by the test centers.
    * 
    * @param testResult
    */
    async createorUpdateCluster(clusterInfo: IClusterInfo): Promise<IHttpResponse> {

        const { userId, time, location } = clusterInfo;
        if (!userId || !time || !location) return ResponseHelper.processFailedResponse(400, 'Invalid request data');

        const currentTime = new Date(Date.now())
        if (new Date(Date.parse(time)) > currentTime) return ResponseHelper.processFailedResponse(400, 'Invalid date');

        const user = await this.userControl.readOne({ user_id: userId })
        if (!user.success) {
            Logger.info(`User with id: ${userId} does not exit`)
            return ResponseHelper.processFailedResponse(400, 'Invalid user');
        }

        const { longitude, latitude } = this.splitLocationData(location);
        if (!longitude || !latitude) return ResponseHelper.processFailedResponse(400, 'Invalid formatted location data');

        const responseFromClusterQuery = await this.getClusterWithinRange(longitude, latitude);
        let clusters: Array<any>

        if (responseFromClusterQuery.success) {

            clusters = responseFromClusterQuery.payload;
            const clusterWithSameLocation = clusters.find(each => {
                const coordinates = each.location.coordinates;
                return coordinates[0] == longitude && coordinates[1] == latitude
            })

            if (clusterWithSameLocation && clusterWithSameLocation.users[userId]) {
                Logger.info(`User ${userId} already exist in this same location lonitude:${longitude}, latitude:${latitude}. Updating their time_left`)
                const update = `users.${userId}.time_left`
                await clusterWithSameLocation.updateOne({ '$set': { [update]: new Date(time) } });
                return ResponseHelper.processSuccessfulResponse('1 cluster updated');
            }

            //update those clusters
            Logger.info(`Found a valid existing cluster. adding user id ${userId} to the cluster`);
            clusters.forEach(cluster => this.updateCluster(userId, time, cluster))

            if (!!!clusterWithSameLocation) {
                Logger.info(`Found existing clusters for user ${userId} but exact location longitude: ${longitude} and latitude:${latitude} does not exit yet. creating extra cluster with the location`)
                return await this.createCluster(longitude, latitude, time, userId);
            }
            return ResponseHelper.processSuccessfulResponse(`${clusters.length} clusters updated`);
        }

        return await this.createCluster(longitude, latitude, time, userId);
    }

    async getClusterWithinRange(longitude: number, latitude: number): Promise<IHttpResponse> {

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

        Logger.info('New cluster created', newCluster)
        return ResponseHelper.processSuccessfulResponse({ ...newCluster });
    }

    async updateCluster(userId: string, time: string, cluster: any) {
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

    extracOtherUserIdsFromClusters(userId: string, payload: Array<ICluster>): Array<string> {
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