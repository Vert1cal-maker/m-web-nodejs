import mysql, { RowDataPacket } from "mysql2";
import { Request } from "express";
import AbstractDataBase from './AbstractDataBase'
import bcrypt from 'bcrypt';
import { Todo } from './Types';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

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


// Interface for a user from the MySQL database
interface IUser extends RowDataPacket {
    id?: number,
    login: string,
    password: string
}



class MysqlServise extends AbstractDataBase {
    static #instanse: MysqlServise;
    private sqlConnect: any;

    constructor() {
        super();
        if (MysqlServise.#instanse) return MysqlServise.#instanse
        MysqlServise.#instanse = this;
    }


    // Retrieves the todos for a specific user based on the provided session ID.
    public async getTodo(req: Request): Promise<Todo[] | undefined> {
        const userInfo = await this.getUser(req.session.unicId);
        if (!userInfo[0]?.id) {
            return undefined;
        }

        const query = `SELECT * FROM todo WHERE user_id = ?`
        const value = [userInfo[0].id];

        return new Promise((resolve, reject) => {
            this.sqlConnect.query(query, value, (err: Error, result: Todo[]) => {
                if (err) reject(err);
                else resolve(result);
            });
        })
    };

    // Adds a new todo item to the database for the authenticated user.
    public async addTodo(req: Request): Promise<{}> {
        const { text, checked = false } = req.body;
        const userId = (await this.getUser(req.session.unicId))[0].id;
        const values = [userId, text, checked];

        const query = `INSERT INTO todo (user_id, text, checked) VALUES (?, ?, ?) `;
        await this.sqlConnect.promise().execute(query, values).catch((err: Error) => {
            console.error("Error inserting data into todo list:", err);
            throw new Error();
        });
        return (await this.getTodoId())[0];
    }

    // Updates an existing todo item in the database.
    public async changeTodo(req: Request): Promise<{}> {
        try {
            const query = 'UPDATE todo SET text = ?, checked = ? WHERE id = ?';
            const { text, checked, id } = req.body;
            const value = [text, checked, id];

            return this.sqlConnect.promise().execute(query, value).
                catch((error: Error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    };


    // Deletes a todo item from the database.
    public async delete(req: Request): Promise<{}> {
        try {
            const query = `DELETE FROM todo WHERE id=?`;
            const values = [req.body.id];

            await this.sqlConnect.promise().execute(query, values)
                .catch((error: Error) => {
                    console.error(error);
                });
            return { ok: true }
        } catch (error) {
            console.error(error);
            throw new Error();
        }
    }

    // Authenticates a user based on the provided login and password.
    // If the authentication is successful, the user's login is stored in the session.
    public async login(req: Request): Promise<{}> {
        const { login, pass } = req.body;
        if (await this.audit(login, pass)) {
            req.session.unicId = login;
            return { "ok": true };
        } else {
            return { "err": "no user exist" };
        }
    }

    // Registers a new user with the provided login and password.
    public async register(req: Request): Promise<{}> {
        const { login, pass } = req.body;
        const userId = await this.getUser(login);
        const password = await this.hashingPassword(pass);
        if (userId.length<1) {
            try {
                await this.addUser(login, password);
                return { "ok": true };
            } catch (error) {
                return { err: "Registration error" }
            }
        } else {
            return { error: 'User already exists' };
        }
    }

    // Logs out the authenticated user by destroying their session.
    public logout(req: Request): {} {
        req.session.destroy((err) => {
            if (err) return { err: "Error" };
        });
        return { ok: true };
    }

    // Retrieves a user based on their login from the MySQL database.
    private async getUser(field: string | undefined): Promise<IUser[]> {
        const query = `SELECT id, login, password  FROM users WHERE login = ?`;
        const values = [field];

        return new Promise((resolve, reject) => {
            this.sqlConnect.query(query, values, (_err: Error, res: IUser[]) => {
                if (_err) reject(_err);
                else {
                    resolve(res);
                }
            }
            )
        })
    };

    // Retrieves the ID of the last inserted todo item from the MySQL database.
    private async getTodoId(): Promise<IUser> {
        return new Promise((resolve, reject) => {
            this.sqlConnect.query("SELECT `id` FROM `todo` ORDER BY id DESC LIMIT 1", (err: Error, res: IUser) => {
                if (err) reject(err);
                else resolve(res);
            }
            )
        })
    }

    private async hashingPassword(password: string): Promise<String> {
        const salt = bcrypt.genSalt(10);
        return bcrypt.hashSync(password, await salt)
    }

    // Hashes the provided password using bcrypt.
    private async audit(login: string, pass: string): Promise<boolean> {
        try {
            const target = await this.getUser(login);
            return login === target[0].login && bcrypt.compareSync(pass, target[0].password);
        } catch (error) {
            console.log("login value you entered was not found in the database");
            return false;
        }
    }

    // Performs an audit to check if the provided login and password match the user's credentials.
    private async addUser(login: string, password: String) {
        const values = [login, password];
        const query = `INSERT INTO users(login, password) VALUES (?,?)`

        this.sqlConnect.promise().execute(query, values).catch((error: Error) => {
            console.error('Error inserting data into database:', error);
        });
    }

    // Establishes a connection to the MySQL database using the configuration.
    connect(): void {
        try {
            this.sqlConnect = mysql.createConnection(configDataBase);
            this.sqlConnect.connect();
            console.log("Connected");
        } catch (error) {
            console.error("connection error", error);
            throw new Error("Database connection failed");
        }
    }
}

export default new MysqlServise();

