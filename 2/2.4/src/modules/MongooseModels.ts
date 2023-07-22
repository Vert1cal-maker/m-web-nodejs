import mongoose, {Schema} from "mongoose";

/**
 * This file defines Mongoose schemas and models for the Todo and User collections in the MongoDB database.
 * The Todo schema represents a single todo item with text and checked fields, while the User schema represents a user
 * with login, pass (password), and an array of todo items associated with that user.
 */

// Interface for the Todo model
interface ITodo {
    id: string | number,
    text: string,
    checked: boolean
}

// Schema for the Todo model
const TodoChema= new Schema<ITodo>({
    text: {type: String, required: true,},
    checked: {type: Boolean, required: false,}
});

// Virtual property for the Todo model to map the MongoDB _id to the 'id' property
TodoChema.virtual('id').get(function(){
    return this._id.toHexString();
})

// Configure the toJSON method for the Todo model to remove the '_id' field and add the 'id' field to the serialized object
TodoChema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});

// Schema for the User model
const UserChema = new Schema({
    login: {type: String, required: true, unique: true,},
    pass: {type: String, required: true,},
    todo: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo',
    }]
});

// Create the TodoModel and UserModel using the defined schemas
const TodoModel = mongoose.model<ITodo>("Todo", TodoChema);
const UserModel = mongoose.model("User", UserChema);

// Export the TodoModel and UserModel for usage in other parts of the application
export default {TodoModel, UserModel};


