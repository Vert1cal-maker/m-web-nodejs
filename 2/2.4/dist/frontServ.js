"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    const filePath = '/static/index.html';
    res.sendFile(filePath, { root: "/app/src" });
});
app.listen(port, () => {
    console.log(`U are welcom for front server on ${port}`);
});
