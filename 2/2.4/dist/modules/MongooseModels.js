"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schema for the Todo model
const TodoChema = new mongoose_1.Schema({
    text: { type: String, required: true, },
    checked: { type: Boolean, required: false, }
});
// Virtual property for the Todo model to map the MongoDB _id to the 'id' property
TodoChema.virtual('id').get(function () {
    return this._id.toHexString();
});
// Configure the toJSON method for the Todo model to remove the '_id' field and add the 'id' field to the serialized object
TodoChema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});
// Schema for the User model
const UserChema = new mongoose_1.Schema({
    login: { type: String, required: true, unique: true, },
    pass: { type: String, required: true, },
    todo: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Todo',
        }]
});
// Create the TodoModel and UserModel using the defined schemas
const TodoModel = mongoose_1.default.model("Todo", TodoChema);
const UserModel = mongoose_1.default.model("User", UserChema);
// Export the TodoModel and UserModel for usage in other parts of the application
exports.default = { TodoModel, UserModel };
