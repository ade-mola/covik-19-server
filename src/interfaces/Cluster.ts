export interface ICluster {
    location: any;
    users: Object;
}

// incoming cluster data for particular user
export interface IClusterInfo{
    userId:string,
    location: string,
    time: string //date as ISO string
}