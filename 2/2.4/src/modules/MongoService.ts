import AbstractDataBase from "./AbstractDataBase";
import {Request} from "express";
import {Todo, UserInfo} from "./Types";
import models from './MongooseModels';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});


/**
 * This file defines the MongoService class, which extends the AbstractDataBase class.
 * It implements methods for interacting with a MongoDB database using Mongoose models.
 */


class MongoServise extends AbstractDataBase {
    static #instanse : MongoServise;

    public constructor() {
        super();
        if (MongoServise.#instanse) 
            return MongoServise.#instanse;
        
        MongoServise.#instanse = this;
    }


    // Retrieves todo items associated with the authenticated user.
    public async getTodo(req : Request): Promise < Todo[] | undefined > {
        const target = await this.getUser(req.session.unicId);
        if (target !== undefined && target) {
            const user = await models.UserModel.findById(target._id).populate("todo");
            const todoArray = user ?. todo.map((element : mongoose.Types.ObjectId) => {
                return element.toJSON();
            });
            return JSON.parse(JSON.stringify(todoArray));
        }
        return undefined;
    }

    // Establishes a connection to the MongoDB database using the connection string from the environment.
    public async connect() {
        const db = process.env.CONNECT;
        try {
            if (db) {
                await mongoose.connect(db).then((res) => console.log("connect")).catch(err => console.log(err));
            }
        } catch (error) {
            console.log(error);
            throw new Error;
        }
    }

    // Adds a new todo item for the authenticated user.
    public async addTodo(req : Request): Promise < {} > {
        const user = await this.getUser(req.session.unicId);
        const newTodo = {
            text: req.body.text,
            checked: false
        };
        const task = await this.addTodoOnBase(newTodo);

        user ?. todo.push(task.id);
        user ?. save();
        return {id: task.id};
    }

    // Updates an existing todo item for the authenticated user.
    public async changeTodo(req : Request): Promise < {} > {
        const {
            id,
            text,
            checked
        } = req.body;

        try {
            await models.TodoModel.findOneAndUpdate({
                _id: id
            }, {
                $set: {
                    text: text,
                    checked: checked
                }
            }, {new: true});
            return {ok: true};
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    // Deletes a todo item for the authenticated user.
    public async delete(req : Request): Promise < {} > {
        const {
            id: targetRemove
        } = req.body;
        try {
            await models.TodoModel.deleteOne({_id: targetRemove});
            return {ok: true};
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    // Authenticates a user based on the provided login and password.
    // If the authentication is successful, the user's ID is stored in the session.
    public async login(req : Request): Promise < {} > {
        const {
            login,
            pass
        } = req.body;
        const user = await this.getUser(login);
        if (! user) {
            return {error: "No user exist"};
        } else {
            if (await this.audit(login, pass)) {
                req.session.unicId = req.body.login;
                req.session.unicId = req.body.login;
                return {ok: true};
            } else {
                return {error: "Invalid password"};
            }
        }
    }

    // Logs out the authenticated user by destroying their session.
    public logout(req : Request): {} {
        req.session.destroy((err) => {
            if (err) 
                return {err: "Error"};
            
        });
        return {
            ok : true
        };
    }

    // Registers a new user with the provided login and password.
    public async register(req : Request): Promise < {} > {
        const {
            login,
            pass,
            todo
        } = req.body;
        const existingUser = await this.getUser(login);
        if (existingUser) {
            return {error: "User already exists"};
        } else {
            const hashedPass = await this.hashingPassword(pass);
            this.addUser({login, pass: hashedPass, todo});
            return {ok: true};
        }
    }

    // Adds a user to the database.
    private async addUser(user : UserInfo) {
        try {
            await models.UserModel.create(user);
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    // Adds a new todo item to the database.
    private async addTodoOnBase(item : Todo) {
        try {
            return new models.TodoModel(item).save();
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }

    // Retrieves a user based on their login.
    private async getUser(login : String | undefined) {
        try {
            return await models.UserModel.findOne({login});
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    // Performs an audit to check if the provided login and password match the user's credentials.
    private async audit(login : string, pass : string): Promise < boolean > {
        try {
            const target = await this.getUser(login);
            return login === target ?. login && bcrypt.compareSync(pass, target ?. pass);
        } catch (error) {
            console.log("login value you entered was not found in the database");
            return false;
        }
    }

    // Hashes the provided password using bcrypt.
    private async hashingPassword(password : string): Promise < String > {
        const salt = bcrypt.genSalt(10);
        return bcrypt.hashSync(password, await salt)
    }
}


export default new MongoServise();
