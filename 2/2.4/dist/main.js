"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routers_1 = __importDefault(require("./modules/Routers"));
const v2_1 = __importDefault(require("./api/v2/v2"));
const CorsConfig_1 = __importDefault(require("./modules/CorsConfig"));
const DataSession_1 = __importDefault(require("./modules/DataSession"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '..env' });
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(CorsConfig_1.default);
app.use(DataSession_1.default);
app.use("/api", Routers_1.default);
app.use("/api", v2_1.default);
app.listen(port, () => {
    console.log(`Server start on ${port}`);
});
