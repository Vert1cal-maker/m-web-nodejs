"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const session_file_store_1 = __importDefault(require("session-file-store"));
/**
 * This file configures the session management for the Express application.
 * It sets up the session middleware, defines the structure of the session data,
 * and exports the session middleware to be used in the Express application.
 */
// Initialize the session file store
const FileStores = (0, session_file_store_1.default)(express_session_1.default);
// Configuration for the session middleware
const sessionConfig = {
    store: new FileStores({}),
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: true // Resave the session even if it was not modified during the request.
};
// Export the configured session middleware to be used in the Express application.
exports.default = (0, express_session_1.default)(sessionConfig);
