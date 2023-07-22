"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _LocalService_instanse;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const AbstractDataBase_1 = __importDefault(require("./AbstractDataBase"));
/**
 * This file defines a LocalService class that extends the AbstractDataBase class and implements
 * the methods for interacting with a local data storage system. It manages user authentication,
 * task operations (add, update, delete, get), and session handling using the Express session.
 */
class LocalService extends AbstractDataBase_1.default {
    constructor() {
        super();
        this.usersData = []; // Array to store user information (login, pass, and todo items)
        this.pathData = './src/api/v1/items.json'; // File path for storing user data (todo items)
        this.pathCount = '/app/src/modules/idCount.json'; // File path for storing the todo counter
        this.postId = JSON.parse(fs_1.default.readFileSync(this.pathCount, "utf-8")); // Todo item counter
        if (__classPrivateFieldGet(LocalService, _a, "f", _LocalService_instanse))
            return __classPrivateFieldGet(LocalService, _a, "f", _LocalService_instanse);
        __classPrivateFieldSet(LocalService, _a, this, "f", _LocalService_instanse);
    }
    getTodo(req) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (((_b = req.session) === null || _b === void 0 ? void 0 : _b.userIndex) !== undefined) {
                    return this.usersData[req.session.userIndex].todo;
                }
                else {
                    return undefined;
                }
            }
            catch (error) {
                return undefined;
            }
        });
    }
    addTodo(req) {
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { id = this.postId, text, checked = false } = req.body;
            try {
                if (((_b = req.session) === null || _b === void 0 ? void 0 : _b.userIndex) !== undefined) {
                    (_c = this.usersData[req.session.userIndex].todo) === null || _c === void 0 ? void 0 : _c.push({ id, text, checked });
                    return { id: this.postId++ };
                }
                else {
                    return { error: "Error while adding task" };
                }
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    changeTodo(req) {
        var _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const { id, text, checked } = req.body;
            try {
                if (((_b = req.session) === null || _b === void 0 ? void 0 : _b.userIndex) !== undefined) {
                    const targetTodo = (_d = (_c = this.usersData[req.session.userIndex]) === null || _c === void 0 ? void 0 : _c.todo) === null || _d === void 0 ? void 0 : _d.find(item => item.id === id);
                    if (targetTodo) {
                        if ("text" in targetTodo) {
                            targetTodo.text = text;
                        }
                        if ("checked" in targetTodo) {
                            targetTodo.checked = checked;
                        }
                        return { "ok": true };
                    }
                }
                return { "error": "Invalid request format" };
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    delete(req) {
        var _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { id: targetRemove } = req.body;
            try {
                if (((_b = req.session) === null || _b === void 0 ? void 0 : _b.userIndex) !== undefined) {
                    const userTodo = this.usersData[yield this.getUserIndex(req.session.unicId)].todo;
                    if (userTodo) {
                        (_c = this.usersData[req.session.userIndex || -1].todo) === null || _c === void 0 ? void 0 : _c.splice(req.session.userIndex || -1, 1);
                        return { "ok": true };
                    }
                }
                return { "error": "item cannot be deleted" };
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, pass } = req.body;
            try {
                if ((yield this.checkAuthorization(login)) && this.usersData[yield this.getUserIndex(login)].pass === pass) {
                    req.session.unicId = login;
                    req.session.userIndex = yield this.getUserIndex(req.session.unicId);
                    return { ok: true };
                }
                else {
                    return { error: "Invalid user password or login" };
                }
            }
            catch (error) {
                console.log(error);
                return { error: "Login error" };
            }
        });
    }
    ;
    logout(req) {
        return __awaiter(this, void 0, void 0, function* () {
            this.save();
            req.session.destroy((err) => {
                if (err)
                    return { error: err };
            });
            return { "ok": true };
        });
    }
    ;
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, pass } = req.body;
            try {
                if ((yield this.getUserIndex(login)) !== -1) {
                    return { error: 'User already exists' };
                }
                else {
                    this.usersData.push({ "login": login, "pass": pass, "todo": [] });
                    return { "ok": true };
                }
            }
            catch (error) {
                console.error('somthing is wrong', error);
                return { error: 'registration erorr' };
            }
        });
    }
    connect() {
        try {
            if (fs_1.default.existsSync(this.pathData)) {
                this.usersData = JSON.parse(fs_1.default.readFileSync(this.pathData, 'utf-8'));
            }
        }
        catch (error) {
            console.error("Error reading files:", error);
            throw new Error();
        }
    }
    getUserIndex(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((response, reject) => {
                response(this.usersData.findIndex(item => item.login === element));
            });
        });
    }
    checkAuthorization(login) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                res((yield this.getUserIndex(login)) >= 0);
            }));
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = JSON.stringify(this.postId);
                const userSavingData = JSON.stringify(this.usersData);
                yield fs_1.default.promises.writeFile(this.pathData, userSavingData, 'utf-8');
                yield fs_1.default.promises.writeFile(this.pathCount, count, "utf-8");
                console.log('all data was saved.');
            }
            catch (error) {
                console.error('somthing is wrong', error);
            }
        });
    }
    ;
}
_a = LocalService;
_LocalService_instanse = { value: void 0 };
exports.default = new LocalService();
