
import express from 'express'
import requestIp from 'request-ip'

import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { AppError } from './utilies/error.js'
import v1_router from './routes/v1.routes.js'
import { job } from './utilies/cronJop.js'

dotenv.config()
export const bootstrap = (app) => {



    app.enable('trust proxy')
    app.set('trust proxy', true);


    job();
    app.use(express.json())


    const corsOptions = {
        origin: (origin, callback) => {
            callback(null, true); // Allow any origin dynamically
        },
        credentials: true, // Allow credentials (cookies)
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    };


    app.use(cors(corsOptions));

    app.use(morgan('dev'))

     app.use('/api/v1', v1_router)
 


    app.all('*', (req, res, next) => {
        throw new AppError('Route not found', 404)
    })


    app.use((err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
        err.stack = err.stack;

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(process.env.MODE === 'devlopment' && { stack: err.stack })
        });
    });

}