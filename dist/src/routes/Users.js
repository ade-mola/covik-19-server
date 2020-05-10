"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', async (req, res, next) => {
    try {
    }
    catch (error) {
        next(error);
    }
});
router.get('/:userId', async (req, res, next) => {
    try {
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=Users.js.map