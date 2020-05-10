"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
Object.defineProperty(exports, "__esModule", { value: true });
class HttpResponseUtility {
    constructor() { }
    processSuccessfulResponse(data) {
        return {
            success: true,
            error: null,
            payload: data
        };
    }
    processFailedResponse(code, message) {
        return {
            success: false,
            error: {
                code,
                message
            },
            payload: null
        };
    }
}
exports.default = new HttpResponseUtility;
//# sourceMappingURL=Response.js.map