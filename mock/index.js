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

const read_stream = fs.createReadStream(`${__dirname}/users.json`);

read_stream.on('data', chunk => {
    const processed_chunk = Buffer.from(chunk).toString('utf-8');
    
    console.log(read_stream.bytesRead);
    read_stream.pause();
    setTimeout(() => {
        read_stream.resume();
    }, 500);
})