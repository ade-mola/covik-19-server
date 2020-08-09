## Test Result Processing:
1. start
2. read input { userId, isPositive, checkInTime } <--
3. check if inputs are valid : return if not.
4. if isPositive is false, return.
5. fetch clusters to which the user belongs from database.
6. extract ids of possibly infected users, given the following constraints:
    a. the infected user must have joined the cluster at most 14 days from checkInTime.
    b. possibly infected users must have joined or left the cluster ON or AFTER the infected user joined.
    c. the infected user cannot be marked as a possible case BECAUSE it has been confirmed.
7. Send Notifications to the possibly infected users.
8. stop.cxz`e