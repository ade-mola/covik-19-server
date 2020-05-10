"use strict";
/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("./src/models/config");
//
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
//
const app = express_1.default();
app.use(express_1.default.static('public'));
app.use(compression_1.default());
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(body_parser_1.default.json({ limit: '100mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
//
const routeHandler = require('./src/routes/config');
app.use('/', routeHandler);
//
const port = Number(process.env.APP_PORT) || 8585;
//
app.listen(port, async () => {
    console.log(`Server started on port ${port}`);
});
//# sourceMappingURL=index.js.map