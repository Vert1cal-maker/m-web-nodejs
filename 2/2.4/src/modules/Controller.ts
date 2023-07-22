import {Request, Response} from "express";
import MysqlService from "./MySqlService";
import MongoService from "./MongoService";
import LocalService from "./LocalService";
import {Todo} from './Types'

/**
 * Controller class handles incoming HTTP requests and delegates business logic to different data services based on the selected data source.
 * It provides methods for handling various HTTP endpoints related to Todo management and user authentication.
 */
export class Controller {
    private dataType : any;

    constructor() {
         // Select the data service based on the specified data source in the environment variable.
        if (process.env.DATA_BASE) this.selectDataBase(process.env.DATA_BASE)
    };


    // Selects the appropriate data service based on the specified data source.
    private selectDataBase(server : string) {
        switch (server) {
            case 'Mongo':
                {
                    this.dataType = MongoService;
                    this.dataType.connect();
                    return
                }
            case 'Mysql':
                {
                    this.dataType = MysqlService;
                    this.dataType.connect();
                    return
                }
            case 'Local':
                {
                    this.dataType = LocalService;
                    this.dataType.connect();
                    return
                }
            default:
                {
                    this.dataType = MongoService;
                    return
                }
        }
    }

    // Handles the main endpoint, which checks if the user is authenticated.
    public async main(req : Request, res : Response) {
        if (req.session.unicId) {
            res.status(200).json({ok: true});
        } else {
            res.status(404).json({"err": "forbidden"});
        }
    }

    //  Handles the get endpoint, which retrieves a list of Todo items for the authenticated user.
    public async get(req : Request, res : Response) {
        const todos = await this.getTodos(req);
        if (todos === undefined) {
            res.status(403).json({error: 'forbidden'});
        } else {
            res.json({items: todos});
        }
    };

    // Handles the post endpoint, which performs different actions based on the specified action parameter.
    public async post(action : string, req : Request, res : Response) {
        let result: {};
        switch (action) {
            case 'register':
                {
                    result = await this.register(req);
                    if (JSON.stringify(result).includes("error")) {
                        res.status(403).json({error: 'forbidden'});
                        return;
                    }
                    res.json(result);
                    return
                }
            case 'login':
                {
                    result = await this.login(req);
                    if (JSON.stringify(result).includes("user")) {
                        res.status(403).json({error: 'no user exist'});
                        return;
                    }
                    res.json(result);
                    return
                }
            case 'add':
                {
                    result = await this.addTodo(req);
                    res.json(result);
                    return
                }
            case 'logout':
                {
                    result = await this.logout(req);
                    res.json(result);
                    return
                }
            default:
                {
                    res.status(403).json({error: 'forbidden'});
                }
        }
    };

    // Handles the put endpoint, which updates an existing Todo item.
    public async put(req : Request, res : Response) {
        const result = await this.changeTodo(req);
        if (result) 
            res.status(201).json({ok: true});
    }
    
    // Handles the delete endpoint, which deletes a Todo item.
    public async delete(req : Request, res : Response) {
        const result = await this.deleteTodo(req);
        if (result) 
            res.json(result);
    }




   // Business logic methods
    private async getTodos(req : Request): Promise < Todo[] > {
        return this.dataType.getTodo(req);
    };

    private async addTodo(req : Request): Promise < Todo[] > {
        return this.dataType.addTodo(req);
    };

    private async changeTodo(req : Request): Promise < Todo[] > {
        return this.dataType.changeTodo(req);
    };

    private async deleteTodo(req : Request): Promise < Todo[] > {
        return this.dataType.delete(req);
    };

    private async register(req : Request): Promise < Todo[] > {
        return this.dataType.register(req);
    };

    private async logout(req : Request): Promise < Todo[] > {
        return this.dataType.logout(req);
    };

    private async login(req : Request): Promise < Todo[] > {
        return this.dataType.login(req);
    };

}
