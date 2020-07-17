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
//const users = require('./users');

const users_in_batches = generate_user_batches(users_from_file, 5);
const min_time = Date.now() - (14 * 86400000);
const max_time = Date.now();

const generated_data = [];
for ( let batch_index = 0; batch_index < 1; batch_index++) {
    const batch = users_in_batches[batch_index]
    batch.forEach(user => {
        const { user_id } = user;
        const batch_id = `batch${batch_index + 1}`;
        const iterations = generate_random_integer(0go, 2);
        for (let i = 0; i < iterations; i++) {
            const time = generate_random_integer(min_time, max_time);
            const location_index = generate_random_integer(0, 39);
            const { longitude, latitude } = locations_from_file[batch_id][location_index];
            const location = `${longitude}:${latitude}`;
            const cluster_data = {
                time: new Date(time),
                location,
                userId: user_id,
            }

            generated_data.push(cluster_data);
        }
    });
}

const make_cluster_call = async (data = [], i = 0) => {
    try {
        if (!data.length) return;

        await fetch.post(`http://localhost:8585/clusters`, { ...data.shift() });
        setTimeout(() => {
            make_cluster_call( data );
        }, 200);

    } catch (e) {
        console.log(`[Mock] Cluster gen error: ${e.message}`);
    }
}
make_cluster_call(generated_data)

// let expected_data = fs.readFileSync(resolve(__dirname, '../expected-data-two.json'), { encoding: 'utf-8' });
// const e_data = JSON.parse(expected_data);

// let output = {};
// Object.keys(e_data).forEach( userId => {
//     output[userId] = Object.keys(e_data[userId]);
// })

// fs.writeFileSync(resolve(__dirname, '../user-map.json'), JSON.stringify(output));

