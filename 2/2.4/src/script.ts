import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config({path: '/home/vert1cal/node-js/task/.env'});

console.log(process.env.HOST, process.env.SQL_USER, process.env.SQL_PASSWORD  )
// create a connection object 
const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.SQL_USER,
    port: Number(process.env.DB_PORT),
    password: process.env.SQL_PASSWORD,
    database: process.env.DB_NAME
});


// establish a connection
conn.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log("Connect");

        // create a database
        conn.query('CREATE DATABASE IF NOT EXISTS myDataBase', (err) => {
            if (err) {
                console.error("Error creating database");
                return;
            } else {
                console.log("The database is created or already exists");

                // choose a database
                conn.query(`USE myDataBase`, (err, result) => {
                    if (err) {
                        console.error("Error selecting the database");
                    } else {
                        console.log("You selected: myDataBase");

                        // query params
                        const createTableQuery = `
                            CREATE TABLE IF NOT EXISTS users (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                login VARCHAR(255) UNIQUE NOT NULL,
                                password VARCHAR(255) NOT NULL
                            )`;
                        const todoTable = `
                            CREATE TABLE IF NOT EXISTS todo (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                user_id INT,
                                text VARCHAR(255),
                                checked BOOLEAN,
                                FOREIGN KEY (user_id) REFERENCES users(id)
                            )`;

                        // create tables
                        conn.query(createTableQuery, (err, result) => {
                            if (err) {
                                console.error('Error creating table "users"', err);
                            } else {
                                console.log("The table 'users' is created or already exists");

                                // create todo table
                                conn.query(todoTable, (err, result) => {
                                    if (err) {
                                        console.error('Error creating table "todo"', err);
                                    } else {
                                        console.log("The table 'todo' is created or already exists");
                                    }

                                    // disconnect from the database
                                    conn.end();
                                    console.log('Connection is closed');
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
