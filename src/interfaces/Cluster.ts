export interface ICluster {
    location: any;
    users: any;
}

// incoming cluster data for particular user
export interface IClusterInfo{
    userId:string,
    location: string,
    time: string //date as ISO string
}