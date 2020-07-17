/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 */
import { ICluster } from "../../interfaces/Cluster";
const ClusterController = require('../../controllers/Cluster');

class PatientCluster {
    //
    visitedCases: Map<string, boolean> = new Map;
    possibleCases: Map<string, boolean> = new Map;
    patientId: string = '';

    //
    constructor(patientId: string) {
        this.patientId = patientId;
    }

    async getListOfPossibleCasesForGivenUser(userId: string, baseTime: string, isStart: boolean = false) {
        if (this.visitedCases.has(userId)) return;
        if ((userId == this.patientId) && !isStart) return;

        this.visitedCases.set(userId, true); // mark user as visited.
        const clusters: Array<ICluster> = await ClusterController.readMany({
            [`users.${userId}`]: { timeJoined: { $gte: baseTime } },
        });

        const users = clusters.reduce((all_users: any, cluster) => {
            return [ ...all_users, ...cluster.users ];
        }, []);

        //
        users.forEach(async (user: any) => {
            if (user.timeLeft >= baseTime) {
                this.possibleCases.set(user, true);
                await this.getListOfPossibleCasesForGivenUser(user.userId, user.timeLeft);
            }
        });

        //
        return;
    }
}

export default PatientCluster;

