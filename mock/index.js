/** */

require('dotenv').config();
const fs = require('fs');
const { resolve } = require('path');
const fetch = require('axios').default;

const mongo_client = require('mongodb').MongoClient;
const url = process.env.MONGO_LOCAL;

const users_from_file = require('./users');
const locations_from_file = require('./location');

const {
    generate_cluster_data,
    generate_random_users,
    generate_random_integer,
    generate_user_batches,
} = require('./functions');
const users = require('./users');

let expected_data = fs.readFileSync(resolve(__dirname, '../expected-data-two.json'), { encoding: 'utf-8' });
const e_data = JSON.parse(expected_data);

let output = {};
Object.keys(e_data).forEach( userId => {
    output[userId] = Object.keys(e_data[userId]);
})

fs.writeFileSync(resolve(__dirname, '../user-map.json'), JSON.stringify(output));

