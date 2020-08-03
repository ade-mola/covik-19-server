/** */

const fs = require('fs');
const users = [];
const locations = [];

const { 
    generate_cluster_data, 
    generate_random_users, 
    generate_random_integer, 
    generate_user_batches,
} = require('./functions');
//const users = require('./users');

mongo_client.connect(url, async function (err, db) {
    if (err) {
        console.log('conneciton failed');
        return
    }

    console.log('connected');
    const _db = db.db('Covik_QA');

    _db.collection('clusters').find({ [`users.4.time_joined`] : { $gte: new Date('2020-07-10T10:00:00.000Z') } }, (e, d) => {
        d.on('data', data => console.log(data.users));
    });

});

// let expected_data = fs.readFileSync(resolve(__dirname, '../expected-data-two.json'), { encoding: 'utf-8' });
// const e_data = JSON.parse(expected_data);

// let output = {};
// Object.keys(e_data).forEach( userId => {
//     output[userId] = Object.keys(e_data[userId]);
// })

// fs.writeFileSync(resolve(__dirname, '../user-map.json'), JSON.stringify(output));

