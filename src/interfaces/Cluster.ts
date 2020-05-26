export interface ICluster {
    location: any;
    time: string;
    users: Array<string>;
}

export interface IClusterInfo{
    userId:string,
    location: string,
    time: string //date as ISO string
}