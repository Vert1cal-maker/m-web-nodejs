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
var _a, _MysqlServise_instanse;
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const AbstractDataBase_1 = __importDefault(require("./AbstractDataBase"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
/**
 * This file defines the MysqlService class, which extends the AbstractDataBase class.
 * It implements methods for interacting with a MySQL database using the mysql2 library.
 */
// configuration of connection to database
const configDataBase = {
    host: process.env.HOST,
    user: process.env.SQL_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.SQL_PASSWORD,
    database: process.env.DB_NAME
};
class MysqlServise extends AbstractDataBase_1.default {
    constructor() {
        super();
        if (__classPrivateFieldGet(MysqlServise, _a, "f", _MysqlServise_instanse))
            return __classPrivateFieldGet(MysqlServise, _a, "f", _MysqlServise_instanse);
        __classPrivateFieldSet(MysqlServise, _a, this, "f", _MysqlServise_instanse);
    }
    // Retrieves the todos for a specific user based on the provided session ID.
    getTodo(req) {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.getUser(req.session.unicId);
            if (!((_b = userInfo[0]) === null || _b === void 0 ? void 0 : _b.id)) {
                return undefined;
            }
            const query = `SELECT * FROM todo WHERE user_id = ?`;
            const value = [userInfo[0].id];
            return new Promise((resolve, reject) => {
                this.sqlConnect.query(query, value, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            });
        });
    }
    ;
    // Adds a new todo item to the database for the authenticated user.
    addTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { text, checked = false } = req.body;
            const userId = (yield this.getUser(req.session.unicId))[0].id;
            const values = [userId, text, checked];
            const query = `INSERT INTO todo (user_id, text, checked) VALUES (?, ?, ?) `;
            yield this.sqlConnect.promise().execute(query, values).catch((err) => {
                console.error("Error inserting data into todo list:", err);
                throw new Error();
            });
            return (yield this.getTodoId())[0];
        });
    }
    // Updates an existing todo item in the database.
    changeTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'UPDATE todo SET text = ?, checked = ? WHERE id = ?';
                const { text, checked, id } = req.body;
                const value = [text, checked, id];
                return this.sqlConnect.promise().execute(query, value).
                    catch((error) => {
                    console.error(error);
                });
            }
            catch (error) {
                console.error(error);
                throw new Error();
            }
        });
    }
    ;
    // Deletes a todo item from the database.
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = `DELETE FROM todo WHERE id=?`;
                const values = [req.body.id];
                yield this.sqlConnect.promise().execute(query, values)
                    .catch((error) => {
                    console.error(error);
                });
                return { ok: true };
            }
            catch (error) {
                console.error(error);
                throw new Error();
            }
        });
    }
    // Authenticates a user based on the provided login and password.
    // If the authentication is successful, the user's login is stored in the session.
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, pass } = req.body;
            if (yield this.audit(login, pass)) {
                req.session.unicId = login;
                return { "ok": true };
            }
            else {
                return { "err": "no user exist" };
            }
        });
    }
    // Registers a new user with the provided login and password.
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login, pass } = req.body;
            const userId = yield this.getUser(login);
            const password = yield this.hashingPassword(pass);
            if (userId.length < 1) {
                try {
                    yield this.addUser(login, password);
                    return { "ok": true };
                }
                catch (error) {
                    return { err: "Registration error" };
                }
            }
            else {
                return { error: 'User already exists' };
            }
        });
    }
    // Logs out the authenticated user by destroying their session.
    logout(req) {
        req.session.destroy((err) => {
            if (err)
                return { err: "Error" };
        });
        return { ok: true };
    }
    // Retrieves a user based on their login from the MySQL database.
    getUser(field) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id, login, password  FROM users WHERE login = ?`;
            const values = [field];
            return new Promise((resolve, reject) => {
                this.sqlConnect.query(query, values, (_err, res) => {
                    if (_err)
                        reject(_err);
                    else {
                        resolve(res);
                    }
                });
            });
        });
    }
    ;
    // Retrieves the ID of the last inserted todo item from the MySQL database.
    getTodoId() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.sqlConnect.query("SELECT `id` FROM `todo` ORDER BY id DESC LIMIT 1", (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(res);
                });
            });
        });
    }
    hashingPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = bcrypt_1.default.genSalt(10);
            return bcrypt_1.default.hashSync(password, yield salt);
        });
    }
    // Hashes the provided password using bcrypt.
    audit(login, pass) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const target = yield this.getUser(login);
                return login === target[0].login && bcrypt_1.default.compareSync(pass, target[0].password);
            }
            catch (error) {
                console.log("login value you entered was not found in the database");
                return false;
            }
        });
    }
    // Performs an audit to check if the provided login and password match the user's credentials.
    addUser(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = [login, password];
            const query = `INSERT INTO users(login, password) VALUES (?,?)`;
            this.sqlConnect.promise().execute(query, values).catch((error) => {
                console.error('Error inserting data into database:', error);
            });
        });
    }
    // Establishes a connection to the MySQL database using the configuration.
    connect() {
        try {
            this.sqlConnect = mysql2_1.default.createConnection(configDataBase);
            this.sqlConnect.connect();
            console.log("Connected");
        }
        catch (error) {
            console.error("connection error", error);
            throw new Error("Database connection failed");
        }
    }
}
_a = MysqlServise;
_MysqlServise_instanse = { value: void 0 };
exports.default = new MysqlServise();
