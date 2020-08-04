export interface ICluster {
    location: any;
    time?: string;
    users: any;
}

export interface IClusterInfo{
    userId:string,
    location: string,
    time: string //date as ISO string
}