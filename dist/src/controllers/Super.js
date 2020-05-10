"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class SuperController {
    constructor() { }
    async jsonize(data) {
        return JSON.parse(JSON.stringify(Object.assign({}, data)));
    }
    determinePagination(page, population) {
        if (page && !population)
            return {
                skip: page
            };
        if (page && population)
            return {
                skip: page * population,
                limit: population
            };
        return {};
    }
}
exports.default = SuperController;
//# sourceMappingURL=Super.js.map