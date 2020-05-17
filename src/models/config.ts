/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import dotenv from 'dotenv';
import mongoose, { Mongoose } from 'mongoose';

import LoggerInstance from '../utilities/Logger'

dotenv.config();

class CovikDatabase {
    private mongoose: Mongoose;
    private database: string;

    constructor (mongoose: Mongoose) {
        const { NODE_ENV, MONGO_URI, MONGOLAB_URI, MONGOHQ_URI, MONGO_LOCAL } = process.env;
        this.mongoose = mongoose;
        this.database = NODE_ENV === 'production' ? MONGO_URI || MONGOLAB_URI || MONGOHQ_URI || '' : MONGO_LOCAL || '';

        this.connect();
    }

    connect(): void {
        this.mongoose.connect(this.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10
        }).then(() => LoggerInstance.info(`Connected to ${this.database}...`));
    }
}

export default new CovikDatabase(mongoose);