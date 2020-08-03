let a = 'Arrived Monday 12:00AM does not have virus. Left 1:58AM'; // has no chance of contacting virus
let b = ' Arrived Monday 2:00AM has virus'; // already has virus
let c = 'Arrived Monday 12:00AM does not have virus. Left 2:05AM'; // has a chance of contacting virus

let data_to_collect = {
    time: '',
    userId: '',
    location: '',
}

let cluster = {
    time_joined: '10:00AM' ,
    time_left: '10:00AM' ,
}


let cluster_repeat = {
    time_joined: '10:00AM',
    time_left: '10:05AM'
}

let infected_patient = {
    time_joined: '10:03AM',
    time_left: '10:03AM',
}

clusters.find({
    $or : {
        time_joined: { $gte: infected_patient.time_joined },
        time_left: { $gte: infected_patient.time_joined },
    }
});

let cluster_rules = [
    'If user does not exist in cluster, time_joined and time_left will be the same',
    'If user exists in cluster, time_left will be updated to time in payload',
];

let edge_case = [
    'An uninfected person arrives after an infected person',
    'An uninfected person arrives before an infected person but leaves after the infected person arrives.',
    '',
]

// let user_to_cluster = {
//     [userId] : {
//         [cluster1Id]: '',
//         [cluster2Id]: '',
//         [cluster3Id]: '',
//     }
//     // ...
// }

let user_to_cluster_user = {
    [userId] : [  ]
}

// let cluster_to_cluster = {
//     [cluster] : {
//         [user1]: {
//             time_joined,
//             time_left
//         },
//         [user2]: {
//             time_joined,
//             time_left
//         },
//     },
//     // ...
// }