/** */

module.exports.generate_random_integer = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.generate_user_batches = (data = [], num_of_batches = 1) => {
    let user_batches = [];
    const population = Math.ceil(data.length / num_of_batches);

    let start = 0;
    for (let i = 0; i < num_of_batches; i++) {
        const end = population * (i + 1);
        user_batches[i] = data.slice(start, end);
        start = end;
    }

    return user_batches;
}

module.exports.generate_cluster_data = (user_batch = [], location_batch = [], cluster = [], i = 0) => {
    const limit = user_batch.length * location_batch.length;
    if ( i >= limit ) return cluster;

    const min_time = Date.now() - (14 * 864000000);
    const max_time = Date.now() - (4 * 864000000);

    const location = location_batch[generate_random_integer(0, location_batch.length - 1)];
    const time = generate_random_integer(min_time, max_time);
    const users = generate_random_users(user_batch);

    cluster.push({
        location,
        time,
        users,
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
    });

    generate_cluster_data(user_batch, location_batch, cluster, (i + 1));
}

module.exports.generate_random_users = (users = []) => {
    const iterations = generate_random_integer(0, users.length - 1);
    let random_users = [];
    for (let i = 0; i < iterations; i++) {
        const index = generate_random_integer(0, users.length - 1);
        random_users.push(users[index]);
    }

    return random_users;
}