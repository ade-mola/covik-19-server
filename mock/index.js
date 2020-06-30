/** */

require('dotenv').config();
const fs = require('fs');
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

/** */
const users_in_batches = generate_user_batches(users_from_file, 5);
const min_time = Date.now() - (14 * 864000000);
const max_time = Date.now();

const generated_data = [];
users_in_batches.forEach((batch, batch_index) => {
    batch.forEach(user => {
        const { user_id } = user;
        const batch_id = `batch${batch_index + 1}`;
        const iterations = generate_random_integer(10, 20);
        for (let i = 0; i < iterations; i++) {
            const time = generate_random_integer(min_time, max_time);
            const location_index = generate_random_integer(0, 39);
            const { longitude, latitude } = locations_from_file[batch_id][location_index];
            const location = `${longitude}:${latitude}`;
            const cluster_data = {
                time,
                location,
                userId: user_id,
            }

            generated_data.push(cluster_data);
        }
    });
});

const make_cluster_call = async (data = []) => {
    try {
        if (!data.length) return;
        
        await fetch.post(``, { ...data.shift() });
        setTimeout(() => {
            make_cluster_call( data );
        }, 1500);

    } catch (e) {
        console.log(`[Mock] Cluster gen error: ${e.message}`);
    }
}

make_cluster_call(generated_data);

// mongo_client.connect(url, async function (err, db) {
//     if (err) {
//         console.log('conneciton failed');
//         return
//     }

//     const _db = db.db('Covik_QA');
//     clear_and_populate_users(_db, users_from_file);
// });

// const clear_and_populate_users = (_db, list) => {
//     _db.collection('users').remove({}, (e, c) => e);
//     _db.collection('users').insertMany(list, (err, result) => {
//         if (err) {
//             console.log(`[User upload err]`, err);
//             return;
//         }

//         console.log(result, 'upload done.');
//         _db.close();
//     });
// }