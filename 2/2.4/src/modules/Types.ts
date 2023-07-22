
// The type of data that will be entered into the database
export type Todo = {
    "id"?: string | Number;
    "text": string,
    "checked": boolean
}

 export type UserInfo = {
    "login": string,
    "pass": number|String,
    "todo": Todo[],
}
