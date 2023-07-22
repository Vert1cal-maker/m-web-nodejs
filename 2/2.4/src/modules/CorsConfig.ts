import cors from 'cors';

// Configuration courses for setting up sources that have access to our server,
const config = { 
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
    credentials: true,
};


export default cors(config);