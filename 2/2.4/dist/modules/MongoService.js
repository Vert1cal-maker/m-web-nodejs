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
var _a, _MongoServise_instanse;
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractDataBase_1 = __importDefault(require("./AbstractDataBase"));
const MongooseModels_1 = __importDefault(require("./MongooseModels"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
/**
 * This file defines the MongoService class, which extends the AbstractDataBase class.
 * It implements methods for interacting with a MongoDB database using Mongoose models.
 */
class MongoServise extends AbstractDataBase_1.default {
    constructor() {
        super();
        if (__classPrivateFieldGet(MongoServise, _a, "f", _MongoServise_instanse))
            return __classPrivateFieldGet(MongoServise, _a, "f", _MongoServise_instanse);
        __classPrivateFieldSet(MongoServise, _a, this, "f", _MongoServise_instanse);
    }
    // Retrieves todo items associated with the authenticated user.
    getTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = yield this.getUser(req.session.unicId);
            if (target !== undefined && target) {
                const user = yield MongooseModels_1.default.UserModel.findById(target._id).populate("todo");
                const todoArray = user === null || user === void 0 ? void 0 : user.todo.map((element) => {
                    return element.toJSON();
                });
                return JSON.parse(JSON.stringify(todoArray));
            }
            return undefined;
        });
    }
    // Establishes a connection to the MongoDB database using the connection string from the environment.
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = process.env.CONNECT;
            try {
                if (db) {
                    yield mongoose_1.default.connect(db).then((res) => console.log("connect")).catch(err => console.log(err));
                }
            }
            catch (error) {
                console.log(error);
                throw new Error;
            }
        });
    }
    // Adds a new todo item for the authenticated user.
    addTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(req.session.unicId);
            const newTodo = {
                text: req.body.text,
                checked: false
            };
            const task = yield this.addTodoOnBase(newTodo);
            user === null || user === void 0 ? void 0 : user.todo.push(task.id);
            user === null || user === void 0 ? void 0 : user.save();
            return { id: task.id };
        });
    }
    // Updates an existing todo item for the authenticated user.
    changeTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, text, checked } = req.body;
            try {
                yield MongooseModels_1.default.TodoModel.findOneAndUpdate({
                    _id: id
                }, {
                    $set: {
                        text: text,
                        checked: checked
                    }
                }, { new: true });
                return { ok: true };
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    // Deletes a todo item for the authenticated user.
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: targetRemove } = req.body;
            try {
                yield MongooseModels_1.default.TodoModel.deleteOne({ _id: targetRemove });
                return { ok: true };
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    // Authenticates a user based on the provided login and password.
    // If the authentication is successful, the user's ID is stored in the session.
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, pass } = req.body;
            const user = yield this.getUser(login);
            if (!user) {
                return { error: "No user exist" };
            }
            else {
                if (yield this.audit(login, pass)) {
                    req.session.unicId = req.body.login;
                    req.session.unicId = req.body.login;
                    return { ok: true };
                }
                else {
                    return { error: "Invalid password" };
                }
            }
        });
    }
    // Logs out the authenticated user by destroying their session.
    logout(req) {
        req.session.destroy((err) => {
            if (err)
                return { err: "Error" };
        });
        return {
            ok: true
        };
    }
    // Registers a new user with the provided login and password.
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, pass, todo } = req.body;
            const existingUser = yield this.getUser(login);
            if (existingUser) {
                return { error: "User already exists" };
            }
            else {
                const hashedPass = yield this.hashingPassword(pass);
                this.addUser({ login, pass: hashedPass, todo });
                return { ok: true };
            }
        });
    }
    // Adds a user to the database.
    addUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield MongooseModels_1.default.UserModel.create(user);
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    // Adds a new todo item to the database.
    addTodoOnBase(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new MongooseModels_1.default.TodoModel(item).save();
            }
            catch (error) {
                console.log(error);
                throw new Error();
            }
        });
    }
    // Retrieves a user based on their login.
    getUser(login) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield MongooseModels_1.default.UserModel.findOne({ login });
            }
            catch (error) {
                console.log(error);
                return undefined;
            }
        });
    }
    // Performs an audit to check if the provided login and password match the user's credentials.
    audit(login, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const target = yield this.getUser(login);
                return login === (target === null || target === void 0 ? void 0 : target.login) && bcrypt_1.default.compareSync(pass, target === null || target === void 0 ? void 0 : target.pass);
            }
            catch (error) {
                console.log("login value you entered was not found in the database");
                return false;
            }
        });
    }
    // Hashes the provided password using bcrypt.
    hashingPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = bcrypt_1.default.genSalt(10);
            return bcrypt_1.default.hashSync(password, yield salt);
        });
    }
}
_a = MongoServise;
_MongoServise_instanse = { value: void 0 };
exports.default = new MongoServise();
