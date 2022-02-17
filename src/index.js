// Import dependencies
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import consola from 'consola';
import passport from 'passport';

// Import app env vars
import { DB, PORT } from './constants/index';

// Import Router
import userApis from "./apis/users";

// Import passport middleware
require("./middlewares/passport-middleware");

// Init app object
const app = express();


// Use middlewares
// CORS used to allow conectivity among 2 servers
app.use(cors());
// Parser to get the req in a json obj
app.use(express.json());

app.use(passport.initialize());


// inject sub router and apis
// app.use is called every time a request in sent to the server
app.use('/users', userApis);

// Main funtion 
const main = async() => {
    try {
        // conmect to mongo db (user-auth)
        await mongoose.connect(DB);
        consola.success('Base de datos conectada con exito!');
        app.listen(PORT, () => {
            consola.success(`Servidor iniciado en el puerto: ${PORT}`);
        });
    } catch (e) {
        // print in case of error
        consola.error(`Imposible iniciar el servidor \n${e.message}`);
    }
};
main();
