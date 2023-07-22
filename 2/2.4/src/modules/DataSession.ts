
import session from "express-session";
import FileStore from 'session-file-store';

/**
 * This file configures the session management for the Express application.
 * It sets up the session middleware, defines the structure of the session data,
 * and exports the session middleware to be used in the Express application.
 */

// Initialize the session file store
const FileStores = FileStore(session); 

// Extend the session data interface to include custom session properties
declare module 'express-session' {
    interface SessionData {
        unicId: string,
        userIndex: number,
    }
}

// Configuration for the session middleware
const sessionConfig = {
  store: new FileStores({}),              // Use the file store to save session data on the server's filesystem.
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",  // Secret key used to sign the session ID cookie.
  saveUninitialized: true,                // Save uninitialized (new, but not modified) sessions to the store.
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Set the maximum age of the session ID cookie (in milliseconds).
  resave: true                            // Resave the session even if it was not modified during the request.
};


// Export the configured session middleware to be used in the Express application.
export default session(sessionConfig);

