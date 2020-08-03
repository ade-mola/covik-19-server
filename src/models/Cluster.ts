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
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], //[longitude, latitude]
            required:true
        }
    },
    time: {
        type: Date,
        required: true
    },
    users: {
        type: Array,
        required: false
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
    }
});

ClusterSchema.index({ "location": "2dsphere" }, {"unique":false});

const Cluster = exports = mongoose.model('Cluster', ClusterSchema);

module.exports.createRecord = async (data: ICluster): Promise <any> => {
    const new_record = new Cluster({ ...data, createdAt: Date.now() });
    return await new_record.save();
}

module.exports.readRecord = async (options: any, pagination?: IPagination): Promise <any> => {
    return await Cluster.find({
        ...processAlternatives(options),
        // is_active: true
    });
}

module.exports.updateRecord = async (options: any, data: ICluster): Promise <any> => {
    return await Cluster.update({
        ...processAlternatives(options),
        // is_active: true
    }, { ...data });
}

module.exports.deleteRecord = async (options: any) => {
    return await Cluster.update({
        ...processAlternatives(options),
        // is_active: true
    }, {
        is_active: false,
        is_deleted: true
    });
}
