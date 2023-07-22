import {Todo} from './Types'
import {Request} from 'express';

/**
 * TodoService is an abstract class representing the interface for a Todo-related service.
 * It defines a set of methods that need to be implemented by concrete classes that provide
 * functionality to interact with a database or any other data source to perform CRUD operations
 * for Todo objects and user authentication.
 */
abstract class TodoService {
    abstract getTodo(req:Request):Promise<Todo[]|undefined>;
    abstract addTodo(req:Request):Promise<{}>;
    abstract changeTodo(req:Request):Promise<{}>;
    abstract delete(req:Request):Promise<{}>;
    abstract login(req:Request):Promise<{}>;
    abstract logout(req:Request):{};
    abstract register(req:Request):Promise<{}>;
    abstract connect():void;
} 

export default TodoService;