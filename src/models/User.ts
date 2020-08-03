/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import mongoose, { Schema } from 'mongoose';
import { IPagination } from '../interfaces/Pagination';
import { IUser } from '../interfaces/User';

import { processAlternatives } from './ModelHelper';

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    notification_token: {
        type: String,
        required: false,
        unique: true,
        default: '',
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
    is_verified: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now
    }
});


const User = exports = mongoose.model('User', UserSchema);

module.exports.createRecord = async (data: IUser): Promise <any> => {
    const new_record = new User({ ...data });
    return await new_record.save();
}

module.exports.readRecord = async (options: any, pagination?: IPagination): Promise <any> => {
    return await User.find({
        ...processAlternatives(options),
    });
}

module.exports.updateRecord = async (options: any, data: IUser): Promise <any> => {
    return await User.updateMany({
        ...processAlternatives(options),
        is_active: true
    }, data );
}

module.exports.deleteRecord = async (options: any) => {
    return await User.updateMany({
        ...processAlternatives(options),
        is_active: true
    }, {
        is_active: false,
        is_deleted: true
    });
}
