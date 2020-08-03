/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 */
import { ICluster } from "../../interfaces/Cluster";
import ClusterController from '../../controllers/Cluster';

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
        const clusters: Array<ICluster> = (await ClusterController.readMany({
            [`users.${userId}.time_joined`]: { $gte: new Date(baseTime) },
        })).payload || [];

        const user_time_in_cluster: Map<string, any> = new Map;
        clusters.forEach((cluster: any) => {
            for (let uid in cluster.users) {
                if (userId == uid) {
                    const user_cluster_data = cluster.users[uid];
                    user_time_in_cluster.set(cluster._id, [user_cluster_data.time_joined, user_cluster_data.time_left]);
                }
            }
        })


        clusters.forEach(async (cluster: any) => {
            const min_time = (user_time_in_cluster.get(cluster._id))[0];
            const max_time = (user_time_in_cluster.get(cluster._id))[1];


            for (let uid in cluster.users) {
                const user = cluster.users[uid];
                if (uid == userId) continue;
                if ((user.time_joined >= min_time && user.time_joined <= max_time) || (min_time >= user.time_joined && min_time <= user.time_left)) {
                    this.possibleCases.set(uid, true);
                    await this.getListOfPossibleCasesForGivenUser(user.userId, user.time_left);
                }
            }
        });
        return;
    }
}

export default PatientCluster;

