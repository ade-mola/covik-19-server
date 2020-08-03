/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import express, { Application, Router } from "express";
import dotenv from 'dotenv';
dotenv.config();


import './src/models/config';


//
import body_parser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import file_upload from 'express-fileupload';
import helmet from 'helmet';
 
const app: Application = express();

app.use(express.static('public'));
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(body_parser.json({limit: '100mb'}));
app.use(body_parser.urlencoded({limit: '50mb', extended: true}));


//
const routeHandler: Router = require('./src/routes/config');
app.use('/', routeHandler);

//
const port: Number = Number(process.env.PORT) || 8585;

//
app.listen(port, async () => {
    console.log(`Server started on port ${port}`);
})