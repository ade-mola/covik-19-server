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
    unique_key: {
        type: String,
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
    }
});

const User = exports = mongoose.model('User', UserSchema);

exports.createRecord = async (data: IUser): Promise <any> => {
    const new_record = new User({ ...data });
    return await new_record.save();
}

exports.readRecord = async (options: any, pagination?: IPagination): Promise <any> => {
    return await User.find({
        ...processAlternatives(options),
        is_active: true
    }, null, pagination);
}

exports.updateRecord = async (options: any, data: IUser): Promise <any> => {
    return await User.update({
        ...processAlternatives(options),
        is_active: true
    }, { ...data });
}

exports.deleteRecord = async (options: any) => {
    return await User.update({
        ...processAlternatives(options),
        is_active: true
    }, {
        is_active: false,
        is_deleted: true
    });
}