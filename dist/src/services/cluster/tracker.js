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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            var _a, baseTime, currentTime, clusters, ids, users, uniqueKeys;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!testResult.userId)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid request data')];
                        if (!testResult.isPositive)
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse({})];
                        _a = this.getTimeRange(testResult.checkInTime, 14), baseTime = _a.baseTime, currentTime = _a.currentTime;
                        return [4 /*yield*/, this.clusterControl.readMany({
                                users: { $in: testResult.userId },
                                time: { $gte: baseTime, $lte: currentTime }
                            })];
                    case 1:
                        clusters = _b.sent();
                        if (!clusters.success) {
                            Logger_1.default.error(clusters.error.mesage);
                            return [2 /*return*/, Response_1.default.processFailedResponse(500, 'Something went wrong while processing test result')];
                        }
                        ids = this.extracOtherUserIdsFromClusters(testResult.userId, clusters.payload);
                        return [4 /*yield*/, this.userControl.readMany({ _id: { $in: ids.slice() } })];
                    case 2:
                        users = _b.sent();
                        if (!users.success) {
                            Logger_1.default.error(users.error.message);
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse({})];
                        }
                        uniqueKeys = users.payload.map(function (user) { return user.user_id; });
                        return [4 /*yield*/, notification_1.default.sendNotification(uniqueKeys)];
                    case 3:
                        _b.sent();
                        Logger_1.default.info("Notification was sent to users: " + uniqueKeys);
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse({})];
                }
            });
        });
    };
    /**
    * Process test result sent by the test centers.
    *
    * @param testResult
    */
    Tracker.prototype.createorUpdateCluster = function (clusterInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, time, location, user, _a, longitude, latitude, _b, baseTime, currentTime, response, clusters;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = clusterInfo.userId, time = clusterInfo.time, location = clusterInfo.location;
                        if (!userId || !time || !location)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid request data')];
                        return [4 /*yield*/, this.userControl.readOne({ user_id: userId })];
                    case 1:
                        user = _c.sent();
                        if (!user.success) {
                            Logger_1.default.info("User with id: " + userId + " does not exit");
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid user')];
                        }
                        _a = this.splitLocationData(location), longitude = _a.longitude, latitude = _a.latitude;
                        _b = this.getTimeRange(time, 5), baseTime = _b.baseTime, currentTime = _b.currentTime;
                        if (new Date(Date.parse(time)) > currentTime)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid date')];
                        if (!longitude || !latitude)
                            return [2 /*return*/, Response_1.default.processFailedResponse(400, 'Invalid formatted location data')];
                        return [4 /*yield*/, this.clusterControl.readMany({
                                location: {
                                    $near: {
                                        $geometry: {
                                            type: 'Point',
                                            coordinates: [longitude, latitude]
                                        },
                                        $maxDistance: 3,
                                        $minDistance: 0
                                    }
                                },
                                time: { $gte: baseTime, $lte: currentTime }
                            })];
                    case 2:
                        response = _c.sent();
                        if (response.success) {
                            //update those clusters
                            Logger_1.default.info('Found a valid existing cluster. adding user id to the cluster');
                            clusters = response.payload;
                            clusters.forEach(function (cluster) { return _this.updateCluster(userId, cluster); });
                            return [2 /*return*/, Response_1.default.processSuccessfulResponse(clusters.length + " clusters updated")];
                        }
                        return [4 /*yield*/, this.createCluster(longitude, latitude, time, userId)];
                    case 3: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    Tracker.prototype.createCluster = function (longitude, latitude, time, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var newCluster, cluster;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newCluster = {
                            location: {
                                type: 'Point',
                                coordinates: [longitude, latitude]
                            },
                            time: time,
                            users: [userId]
                        };
                        return [4 /*yield*/, this.clusterControl.create(newCluster)];
                    case 1:
                        cluster = _a.sent();
                        if (!cluster.success) {
                            Logger_1.default.error(cluster.error.message);
                            return [2 /*return*/, Response_1.default.processFailedResponse(500, 'Something went wrong while trying to create new cluster')];
                        }
                        Logger_1.default.info('New cluster created', newCluster);
                        return [2 /*return*/, Response_1.default.processSuccessfulResponse(__assign({}, newCluster))];
                }
            });
        });
    };
    Tracker.prototype.updateCluster = function (userId, cluster) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        TODO: 'make use of update cluster model in the ClusterModel class';
                        return [4 /*yield*/, cluster.updateOne({ '$addToSet': { users: userId } })];
                    case 1:
                        _a.sent();
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
    Tracker.prototype.extracOtherUserIdsFromClusters = function (userId, payload) {
        var combinedIds = [];
        payload.forEach(function (cluster) {
            combinedIds = combinedIds.concat(cluster.users);
        });
        return combinedIds.filter(function (id) { return userId !== id; });
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
