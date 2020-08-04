"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/
var Cluster_1 = __importDefault(require("../../controllers/Cluster"));
var User_1 = __importDefault(require("../../controllers/User"));
var notification_1 = __importDefault(require("../notification/notification"));
var Response_1 = __importDefault(require("../../utilities/Response"));
var Logger_1 = __importDefault(require("../../utilities/Logger"));
var patient_clusters_1 = __importDefault(require("../patient-tracking/patient-clusters"));
var clusterQueue = [];
var Tracker = /** @class */ (function () {
    function Tracker() {
        this.clusterControl = Cluster_1.default;
        this.userControl = User_1.default;
    }
    /**
     * Process test result sent by the test centers.
     *
     * @param testResult
     */
    Tracker.prototype.processTestResult = function (testResult) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, isPositive, checkInTime, infectionTracker, cases, infectedUsers, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = testResult.userId, isPositive = testResult.isPositive, checkInTime = testResult.checkInTime;
                        if (!userId)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid request data')];
                        if (!isPositive)
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse({})];
                        infectionTracker = new patient_clusters_1.default(userId);
                        return [4 /*yield*/, infectionTracker.getListOfPossibleCasesForGivenUser(userId, checkInTime, true)];
                    case 1:
                        _a.sent();
                        cases = [];
                        infectionTracker.possibleCases.forEach(function (v, k) { return cases.push(k); });
                        return [4 /*yield*/, User_1.default.readMany({ user_id: cases.join() })];
                    case 2:
                        infectedUsers = _a.sent();
                        tokens = infectedUsers.payload.map(function (e) { return e.token; });
                        notification_1.default.sendNotification(userId, tokens);
                        //
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse({
                                userId: userId,
                                cases: cases,
                            })];
                }
            });
        });
    };
    Tracker.prototype.addAndProcessClusterQueue = function (clusters) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                clusterQueue.push.apply(clusterQueue, clusters);
                this.processClusterQueue();
                return [2 /*return*/];
            });
        });
    };
    Tracker.prototype.processClusterQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                while (clusterQueue.length) {
                    this.createorUpdateCluster(clusterQueue.shift());
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * @param clusterInfo
     */
    Tracker.prototype.createorUpdateCluster = function (clusterInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, time, location, currentTime, user, _a, longitude, latitude, responseFromClusterQuery, clusters, clusterWithSameLocation, update;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = clusterInfo.userId, time = clusterInfo.time, location = clusterInfo.location;
                        if (!userId || !time || !location)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid request data')];
                        currentTime = new Date(Date.now());
                        if (new Date(Date.parse(time)) > currentTime)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid date')];
                        return [4 /*yield*/, this.userControl.readOne({ user_id: userId })];
                    case 1:
                        user = _c.sent();
                        if (!user.success) {
                            Logger_1.default.info("User with id: " + userId + " does not exit");
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid user')];
                        }
                        _a = this.splitLocationData(location), longitude = _a.longitude, latitude = _a.latitude;
                        if (!longitude || !latitude)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid formatted location data')];
                        return [4 /*yield*/, this.getClusterWithinRange(longitude, latitude)];
                    case 2:
                        responseFromClusterQuery = _c.sent();
                        if (!responseFromClusterQuery.success) return [3 /*break*/, 7];
                        clusters = responseFromClusterQuery.payload;
                        clusterWithSameLocation = clusters.find(function (each) {
                            var coordinates = each.location.coordinates;
                            return coordinates[0] == longitude && coordinates[1] == latitude;
                        });
                        if (!(clusterWithSameLocation && clusterWithSameLocation.users[userId])) return [3 /*break*/, 4];
                        Logger_1.default.info("User " + userId + " already exist in this same location lonitude:" + longitude + ", latitude:" + latitude + ". Updating their time_left");
                        update = "users." + userId + ".time_left";
                        return [4 /*yield*/, clusterWithSameLocation.updateOne({ '$set': (_b = {}, _b[update] = new Date(time), _b) })];
                    case 3:
                        _c.sent();
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse('1 cluster updated')];
                    case 4:
                        //update those clusters
                        Logger_1.default.info("Found a valid existing cluster. adding user id " + userId + " to the cluster");
                        clusters.forEach(function (cluster) { return _this.updateCluster(userId, time, cluster); });
                        if (!!!!clusterWithSameLocation) return [3 /*break*/, 6];
                        Logger_1.default.info("Found existing clusters for user " + userId + " but exact location longitude: " + longitude + " and latitude:" + latitude + " does not exit yet. creating extra cluster with the location");
                        return [4 /*yield*/, this.createCluster(longitude, latitude, time, userId)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [2 /*return*/, Response_1.default.processSuccessfulResponse(clusters.length + " clusters updated")];
                    case 7: return [4 /*yield*/, this.createCluster(longitude, latitude, time, userId)];
                    case 8: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    Tracker.prototype.getClusterWithinRange = function (longitude, latitude) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clusterControl.readMany({
                            location: {
                                $near: {
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: [longitude, latitude]
                                    },
                                    $maxDistance: 3,
                                    $minDistance: 0
                                }
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    Tracker.prototype.createCluster = function (longitude, latitude, time, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var newCluster, cluster;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        newCluster = {
                            location: {
                                type: 'Point',
                                coordinates: [longitude, latitude]
                            },
                            users: (_a = {},
                                _a[userId] = {
                                    time_joined: new Date(time),
                                    time_left: new Date(time)
                                },
                                _a)
                        };
                        return [4 /*yield*/, this.clusterControl.create(newCluster)];
                    case 1:
                        cluster = _b.sent();
                        if (!cluster.success) {
                            Logger_1.default.error(cluster.error.message);
                            return [2 /*return*/, Response_1.default.processFailedResponse(500, 'Something went wrong while trying to create new cluster')];
                        }
                        Logger_1.default.info("New cluster created for user ID: " + userId, newCluster);
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, newCluster))];
                }
            });
        });
    };
    Tracker.prototype.updateCluster = function (userId, time, cluster) {
        return __awaiter(this, void 0, void 0, function () {
            var details, update;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        details = {
                            time_joined: new Date(time),
                            time_left: new Date(time)
                        };
                        update = "users." + userId;
                        return [4 /*yield*/, cluster.updateOne({ '$set': (_a = {}, _a[update] = details, _a) })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get time range
     * @param checkInTime time the user checks in for the test.
     */
    Tracker.prototype.getTimeRange = function (checkInTime, days) {
        var currentTime = new Date(Date.now());
        var baseTime = new Date(Date.parse(checkInTime) - (days * 3600 * 24 * 1000));
        return { baseTime: baseTime, currentTime: currentTime };
    };
    Tracker.prototype.extracOtherUserIdsFromClusters = function (userId, checkInTime, payload) {
        var baseTime = this.getTimeRange(checkInTime, 14).baseTime;
        var combinedIds = [];
        payload.forEach(function (cluster) {
            var time_joined = cluster.users[userId].time_joined;
            for (var id in cluster.users) {
                var clusterUser = cluster.users[id];
                if (time_joined < baseTime)
                    continue;
                if (clusterUser.time_joined < time_joined && clusterUser.time_left < time_joined)
                    continue;
                if (id == userId)
                    continue;
                //
                combinedIds.push(id);
            }
        });
        return combinedIds;
    };
    Tracker.prototype.splitLocationData = function (location) {
        var locationArr = location.split(':', 2);
        var longitude = parseFloat(locationArr[0]);
        var latitude = parseFloat(locationArr[1]);
        return { longitude: longitude, latitude: latitude };
    };
    return Tracker;
}());
exports.default = new Tracker;
