
// mongo_client.connect(url, async function (err, db) {
//     if (err) {
//         console.log('conneciton failed');
//         return
//     }
    
    // const _db = db.db('Covik_QA');

    // generate_expected_data(_db, {}, 0, 50, async ( err, data ) => {
    //     if (err) {
    //         console.log(`Nathan write an error free code for once.`);
    //         return;
    //     }

    //     fs.writeFile('./expected-data.json', JSON.stringify(data), (e, d) => {
    //         if (e) return;
    //         console.log('I worked, gentlemen');
    //     });
    // })
    // clear_and_populate_users(_db, users_from_file);
// });

// const generate_expected_data = (_db, expected_data, start = 0, end = 50, callback) => {
//     console.log ({
//         end, 
//         start,
//     });

//     if (start == end) {
//         callback(null, expected_data);
//         return
//     };

//     const userId = generate_random_integer(1, 137);
//     const timestamp = Date.now();
//     const currentTime = new Date(timestamp);
//     const baseTime = new Date(timestamp - (14 * 86400000));

//     _db.collection('clusters').find({
//         users: { $in: [userId.toString()] },
//         time: { $gte: baseTime, $lte: currentTime },
//     }, (err, data) => {
//         if (err) {
//             console.log(`[Expected data gen error] ${err.message}`);
//             return;
//         }

//         data.on( 'data', (d) => {
//             if (!expected_data[userId]) expected_data[userId] = {};

//             d.users.forEach( user => {
//                 expected_data[userId] = {
//                     ...expected_data[userId],
//                     [user] : user,
//                 };
//             });
//         });

//         data.on('end', () => {
//             generate_expected_data(_db, expected_data, (start + 1), end, callback);
//         })

//         data.on('error', err => {
//             callback(err, null);
//         })
//     });
// };

// const clear_and_populate_users = (_db, list) => {
//     _db.collection('users').remove({}, (e, c) => e);
//     _db.collection('users').insertMany(list, (err, result) => {
//         if (err) {
//             console.log(`[User upload err]`, err);
//             return;
//         }

//         console.log(result, 'upload done.');
//     });
// }

/** */
// const users_in_batches = generate_user_batches(users_from_file, 5);
// const min_time = Date.now() - (14 * 864000000);
// const max_time = Date.now();

// const generated_data = [];
// users_in_batches.forEach((batch, batch_index) => {
//     batch.forEach(user => {
//         const { user_id } = user;
//         const batch_id = `batch${batch_index + 1}`;
//         const iterations = generate_random_integer(10, 20);
//         for (let i = 0; i < iterations; i++) {
//             const time = generate_random_integer(min_time, max_time);
//             const location_index = generate_random_integer(0, 39);
//             const { longitude, latitude } = locations_from_file[batch_id][location_index];
//             const location = `${longitude}:${latitude}`;
//             const cluster_data = {
//                 time,
//                 location,
//                 userId: user_id,
//             }

//             generated_data.push(cluster_data);
//         }
//     });
// });

// const make_cluster_call = async (data = [], i = 0) => {
//     try {
//         if (!data.length) return;

//         await fetch.post(``, { ...data.shift() });
//         setTimeout(() => {
//             make_cluster_call( data );
//         }, 1200);

//     } catch (e) {
//         console.log(`[Mock] Cluster gen error: ${e.message}`);
//     }
// }

// // make_cluster_call(generated_data);

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
//     });
// }

/** */

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
            expected_data[userId] = {
                ...expected_data[userId],
                ...extracOtherUserIdsFromClusters(userId, d)
            };
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