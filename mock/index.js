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

// let expected_data = fs.readFileSync(resolve(__dirname, '../expected-data.json'), { encoding: 'utf-8' });
// const e_data = JSON.parse(expected_data);
// console.log(Object.keys(e_data));

mongo_client.connect(url, async function (err, db) {
    if (err) {
        console.log('conneciton failed');
        return
    }

    const _db = db.db('Covik_QA');

    generate_expected_data(_db, {}, 0, 50, async (err, data) => {
        if (err) {
            console.log(`Nathan write an error free code for once.`);
            return;
        }

        fs.writeFile('./expected-data-two.json', JSON.stringify(data), (e, d) => {
            if (e) return;
            console.log('I worked, gentlemen');
        });
    });
});

const generate_expected_data = (_db, expected_data, start = 0, end = 50, callback) => {
    console.log({
        end,
        start,
    });

    if (start == end) {
        callback(null, expected_data);
        return
    };

    const userId = generate_random_integer(1, 137);

    _db.collection('clusters').find({
        [`users.${userId}`]: { $exists: true },
    }, (err, data) => {
        if (err) {
            console.log(`[Expected data gen error] ${err.message}`);
            return;
        }

        data.on('data', (d) => {
            if (!expected_data[userId]) expected_data[userId] = {};
            expected_data[userId] = extracOtherUserIdsFromClusters(userId, d);
        });

        data.on('end', () => {
            generate_expected_data(_db, expected_data, (start + 1), end, callback);
        })

        data.on('error', err => {
            callback(err, null);
        })
    });
};

const extracOtherUserIdsFromClusters = (userId, cluster) => {
    let combinedIds = {};
    for (let id in cluster.users) {
        const clusterUser = cluster.users[id];
        if (id == userId) continue;

        combinedIds[id] = { ...clusterUser };
    }

    return combinedIds;
}

const getTimeRange = (checkInTime, days) => {
    const currentTime = new Date(Date.now());
    const baseTime = new Date(Date.parse(checkInTime) - (days * 3600 * 24 * 1000));

    return { baseTime, currentTime };
}