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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const MySqlService_1 = __importDefault(require("./MySqlService"));
const MongoService_1 = __importDefault(require("./MongoService"));
const LocalService_1 = __importDefault(require("./LocalService"));
/**
 * Controller class handles incoming HTTP requests and delegates business logic to different data services based on the selected data source.
 * It provides methods for handling various HTTP endpoints related to Todo management and user authentication.
 */
class Controller {
    constructor() {
        // Select the data service based on the specified data source in the environment variable.
        if (process.env.DATA_BASE)
            this.selectDataBase(process.env.DATA_BASE);
    }
    ;
    // Selects the appropriate data service based on the specified data source.
    selectDataBase(server) {
        switch (server) {
            case 'Mongo':
                {
                    this.dataType = MongoService_1.default;
                    this.dataType.connect();
                    return;
                }
            case 'Mysql':
                {
                    this.dataType = MySqlService_1.default;
                    this.dataType.connect();
                    return;
                }
            case 'Local':
                {
                    this.dataType = LocalService_1.default;
                    this.dataType.connect();
                    return;
                }
            default:
                {
                    this.dataType = MongoService_1.default;
                    return;
                }
        }
    }
    // Handles the main endpoint, which checks if the user is authenticated.
    main(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.session.unicId) {
                res.status(200).json({ ok: true });
            }
            else {
                res.status(404).json({ "err": "forbidden" });
            }
        });
    }
    //  Handles the get endpoint, which retrieves a list of Todo items for the authenticated user.
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const todos = yield this.getTodos(req);
            if (todos === undefined) {
                res.status(403).json({ error: 'forbidden' });
            }
            else {
                res.json({ items: todos });
            }
        });
    }
    ;
    // Handles the post endpoint, which performs different actions based on the specified action parameter.
    post(action, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            switch (action) {
                case 'register':
                    {
                        result = yield this.register(req);
                        if (JSON.stringify(result).includes("error")) {
                            res.status(403).json({ error: 'forbidden' });
                            return;
                        }
                        res.json(result);
                        return;
                    }
                case 'login':
                    {
                        result = yield this.login(req);
                        if (JSON.stringify(result).includes("user")) {
                            res.status(403).json({ error: 'no user exist' });
                            return;
                        }
                        res.json(result);
                        return;
                    }
                case 'add':
                    {
                        result = yield this.addTodo(req);
                        res.json(result);
                        return;
                    }
                case 'logout':
                    {
                        result = yield this.logout(req);
                        res.json(result);
                        return;
                    }
                default:
                    {
                        res.status(403).json({ error: 'forbidden' });
                    }
            }
        });
    }
    ;
    // Handles the put endpoint, which updates an existing Todo item.
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.changeTodo(req);
            if (result)
                res.status(201).json({ ok: true });
        });
    }
    // Handles the delete endpoint, which deletes a Todo item.
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.deleteTodo(req);
            if (result)
                res.json(result);
        });
    }
    // Business logic methods
    getTodos(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.getTodo(req);
        });
    }
    ;
    addTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.addTodo(req);
        });
    }
    ;
    changeTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.changeTodo(req);
        });
    }
    ;
    deleteTodo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.delete(req);
        });
    }
    ;
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.register(req);
        });
    }
    ;
    logout(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.logout(req);
        });
    }
    ;
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dataType.login(req);
        });
    }
    ;
}
exports.Controller = Controller;
