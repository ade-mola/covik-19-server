/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import mongoose, { Schema } from 'mongoose';
import { IPagination } from '../interfaces/Pagination';
import { ICluster } from '../interfaces/Cluster';

import { processAlternatives } from './ModelHelper';

const ClusterSchema: Schema = new Schema({
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], //[longitude, latitude]
            required:true
        }
    },
    users: {
        type: Object,
        required: false,
        default: {}, /** { <userId>: { time_joined, time_left } } */
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: { 
        type: Date, 
        required: true,
        default: () => new Date(),
    }
});

ClusterSchema.index({ "location": "2dsphere" }, {"unique":true});

const Cluster = exports = mongoose.model('Cluster', ClusterSchema);

module.exports.createRecord = async (data: ICluster): Promise <any> => {
    const new_record = new Cluster({ ...data });
    return await new_record.save();
}

module.exports.readRecord = async (options: any, pagination?: IPagination): Promise <any> => {
    return await Cluster.find({
        ...processAlternatives(options),
        is_active: true
    });
}

module.exports.updateRecord = async (options: any, data: ICluster): Promise <any> => {
    return await Cluster.update({
        ...processAlternatives(options),
        is_active: true
    }, { ...data });
}

module.exports.deleteRecord = async (options: any) => {
    return await Cluster.update({
        ...processAlternatives(options),
        is_active: true
    }, {
        is_active: false,
        is_deleted: true
    });
}
