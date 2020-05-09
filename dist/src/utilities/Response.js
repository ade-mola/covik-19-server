"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
Object.defineProperty(exports, "__esModule", { value: true });
var HttpResponseUtility = /** @class */ (function () {
    function HttpResponseUtility() {
    }
    HttpResponseUtility.prototype.processSuccessfulResponse = function (data) {
        return {
            success: true,
            error: null,
            payload: data
        };
    };
    HttpResponseUtility.prototype.processFailedResponse = function (code, message) {
        return {
            success: false,
            error: {
                code: code,
                message: message
            },
            payload: null
        };
    };
    return HttpResponseUtility;
}());
exports.default = new HttpResponseUtility;
