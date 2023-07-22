"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controller_1 = require("./Controller");
const router = (0, express_1.default)();
const controller = new Controller_1.Controller();
router.get('/', (req, res) => controller.main(req, res));
router.get("/v1/items", (req, res) => controller.get(req, res));
router.post('/v1/register', (req, res) => controller.post('register', req, res));
router.post('/v1/login', (req, res) => controller.post('login', req, res));
router.post('/v1/logout', (req, res) => controller.post('logout', req, res));
router.post("/v1/items", (req, res) => controller.post('add', req, res));
router.put("/v1/items", (req, res) => controller.put(req, res));
router.delete("/v1/items", (req, res) => controller.delete(req, res));
exports.default = router;
