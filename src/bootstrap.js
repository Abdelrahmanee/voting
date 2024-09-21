
import express from 'express'
import requestIp from 'request-ip'

import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { AppError } from './utilies/error.js'
import v1_router from './routes/v1.routes.js'

dotenv.config()
export const bootstrap = (app) => {


    // app.use((req, res, next) => {
    //     let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //     // Map ::1 to 127.0.0.1 for local development
    //     if (clientIp === '::1') {
    //         clientIp = '127.0.0.1';
    //     }

    //     console.log('Client IP:', clientIp);
    //     next();
    // });

    app.enable('trust proxy')
    app.set('trust proxy', true);


    app.use(express.json())


    app.use(cors());


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