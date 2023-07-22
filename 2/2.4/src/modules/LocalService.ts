import fs from "fs";
import { Request} from "express";
import { Todo, UserInfo } from './Types';
import AbstractDataBase from './AbstractDataBase';


/**
 * This file defines a LocalService class that extends the AbstractDataBase class and implements
 * the methods for interacting with a local data storage system. It manages user authentication,
 * task operations (add, update, delete, get), and session handling using the Express session.
 */

class LocalService extends AbstractDataBase{
    static #instanse: LocalService;
    private usersData: UserInfo[] = []; // Array to store user information (login, pass, and todo items)
    private pathData = './src/api/v1/items.json'; // File path for storing user data (todo items)
    private pathCount = './src/modules/idCount.json'; // File path for storing the todo counter
    private postId: number = JSON.parse(fs.readFileSync(this.pathCount, "utf-8")); // Todo item counter

    public constructor(){
        super();
        if (LocalService.#instanse) return LocalService.#instanse;
        LocalService.#instanse = this;
    }


    public async getTodo(req: Request): Promise<Todo[] | undefined> {
        try {
          if (req.session?.userIndex !== undefined) {
            return this.usersData[req.session.userIndex].todo;
          } else {
            return undefined;
          }
        } catch (error) {
          return undefined;
        }
      }

    public async addTodo(req:Request):Promise<{}>{
        const { id = this.postId, text, checked = false } = req.body;
        try {
            if (req.session?.userIndex !== undefined) {
            this.usersData[req.session.userIndex].todo?.push({ id, text, checked });
                return {id: this.postId++};
            } else {
                return { error: "Error while adding task" };
            }
        } catch (error) {
            console.log(error);
           throw new Error();
        }
    }

    public async changeTodo(req: Request): Promise<{}> {
        const { id, text, checked } = req.body;
        try {
            if (req.session?.userIndex !== undefined) {
                const targetTodo: Todo | undefined = this.usersData[req.session.userIndex]?.todo?.find(item => item.id === id);
                if (targetTodo) {
                    if ("text" in targetTodo) {
                        targetTodo.text = text
                    }
                    if ("checked" in targetTodo) {
                        targetTodo.checked = checked
                    }
                   return { "ok": true };
                } 
            } 
            return {"error" : "Invalid request format"};
        } catch (error) {
            console.log(error);
            throw new Error();
        }
    }
   
    public async delete(req: Request): Promise<{}> {
        const { id: targetRemove } = req.body;
        try {
            if (req.session?.userIndex !== undefined) {
                const userTodo = this.usersData[await this.getUserIndex(req.session.unicId)].todo;
                if (userTodo) {
                    this.usersData[req.session.userIndex||-1].todo?.splice(req.session.userIndex||-1, 1);
                    return { "ok": true };
                }
            }
                return { "error": "item cannot be deleted" };
        } catch (error) {
            console.log(error);
            throw new Error();
        }
     }

     public async login(req: Request): Promise<{}> {
        const { login, pass } = req.body
        try {
                if (await this.checkAuthorization(login) && this.usersData[await this.getUserIndex(login)].pass === pass) {  
                    req.session.unicId = login;
                    req.session.userIndex = await this.getUserIndex(req.session.unicId); 
                    return {ok:true};
                } else {
                    return { error: "Invalid user password or login" };
                }
        } catch (error) {
           console.log(error);
           return {error: "Login error"}
        }
     };



    public async logout(req:Request):Promise<{}>{
        this.save();
            req.session.destroy((err) => {
                if (err)
                 return {error: err};
            });
           return{ "ok": true };
    };

    public async register(req:Request):Promise<{}>{
        const { login, pass } = req.body;
        try {
            if (await this.getUserIndex(login)!==-1 ) {
                return { error: 'User already exists' };
            } else {
                this.usersData.push({ "login": login, "pass": pass, "todo": [] });
                return { "ok": true };
            }
        } catch (error) {
            console.error('somthing is wrong', error);
            return { error: 'registration erorr' };
        }
    }

    public connect():void{
        try {
            if (fs.existsSync(this.pathData)) {
                this.usersData = JSON.parse(fs.readFileSync(this.pathData, 'utf-8'));
            }
        } catch (error) {
            console.error("Error reading files:", error);
            throw new Error();
        }
    }


    private async getUserIndex(element: string | undefined): Promise<number> {
        return new Promise((response,reject)=>{
            response(this.usersData.findIndex(item => item.login === element));
         })
    }

    private async checkAuthorization(login: string): Promise<boolean>{
        return new Promise(async (res,rej)=>{
           res(await this.getUserIndex(login)>=0);
        })
    }


    public async save() {
        try {
            const count = JSON.stringify(this.postId);
            const userSavingData = JSON.stringify(this.usersData)
            await fs.promises.writeFile(this.pathData, userSavingData, 'utf-8');
            await fs.promises.writeFile(this.pathCount, count, "utf-8");
            console.log('all data was saved.');
        } catch (error) {
            console.error('somthing is wrong', error);
        }
    };

}

export default new LocalService();