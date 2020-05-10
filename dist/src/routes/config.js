"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
/** ROUTE FILES */
const Users_1 = __importDefault(require("./Users"));
/** CONFIG */
const router = express_1.default.Router();
router.use(async (req, res, next) => {
    req.headers["access-control-allow-origin"] = '*';
    req.headers["access-control-allow-headers"] = '*';
    if (req.method === 'OPTIONS') {
        req.headers["access-control-allow-methods"] = 'GET, POST, PUT, PATCH, DELETE';
        res.status(200).json();
    }
    next();
});
/** */
router.use('/users', Users_1.default);
/** STATIC HANDLERS */
// router.use('/images/image/:image_uri', async(req: Request, res: Response) => {
//     res.sendFile(path.resolve(__dirname, `../../public/images/${req.params.image_uri}`));
// });
router.use(async (req, res, next) => {
    res.sendFile(path_1.default.resolve(__dirname, `../../public/index.html`));
});
router.use(async (error, req, res, next) => {
    return res.status(error.status || 500).json({
        message: error.message || "Internal Server Error"
    });
});
module.exports = router;
//# sourceMappingURL=config.js.map