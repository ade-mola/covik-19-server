/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import express, { Router, Response, Request, NextFunction } from "express";
import path from 'path';

/** ROUTE FILES */
import users_route_handler from './Users';
import clusters_route_handler from './cluster'

/** CONFIG */
const router : Router = express.Router();


router.use(async (req: Request, res: Response, next: NextFunction) => {
    req.headers["access-control-allow-origin"] = '*';
    req.headers["access-control-allow-headers"] = '*';

    if (req.method === 'OPTIONS') {
        req.headers["access-control-allow-methods"] = 'GET, POST, PUT, PATCH, DELETE';
        res.status(200).json();
    }

    next();
});

/** */
router.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[Route Config] Incoming request: ${req.method} ${req.path} ${req.ip}`);
    next();
})
router.use('/users', users_route_handler);
router.use('/clusters', clusters_route_handler);

/** STATIC HANDLERS */
router.use('/images/image/:image_uri', async(req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, `../../public/images/${req.params.image_uri}`));
});

/**  EXCEPTIONS */
router.use(async (req: Request, res: Response, next: NextFunction) => {
    const error = {
        status: 404,
        message: 'Resource not found'
    }

    next(error);
});

router.use(async (error: any, req: Request, res: Response, next: NextFunction) => {
    console.log(error)
    console.log(`[Route Config] general error: ${error.message}`);
    return res.status(error.status || 500).send({
        success: false,
            error: {
                code: error.status || 500,
                message: error.message || 'Internal Server error'
            },
            payload: null
    });
});

module.exports = router;