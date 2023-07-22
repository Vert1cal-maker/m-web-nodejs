"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controller_1 = require("../../modules/Controller");
const router = (0, express_1.default)();
const controller = new Controller_1.Controller;
const postAction = ['login', 'register', 'logout', 'deleteItem'];
const actions = {
    login: controller.post.bind(controller),
    logout: controller.post.bind(controller),
    register: controller.post.bind(controller),
    getItems: controller.get.bind(controller),
    deleteItem: controller.delete.bind(controller),
    createItem: controller.post.bind(controller),
    editItem: controller.put.bind(controller),
};
router.all('/v2/router', (req, res) => {
    const action = req.query.action;
    if (action !== undefined && action in actions) {
        if (postAction.includes(action)) {
            actions[action](action, req, res);
        }
        else {
            actions[action](req, res);
        }
    }
    else {
        res.status(400).json({ error: 'Invalid action' });
    }
});
exports.default = router;
