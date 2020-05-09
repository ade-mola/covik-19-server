/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import express, { Router, Response, Request, NextFunction } from "express";
import path from 'path';
import ResponseUtility from '../utilities/Response';

/** ROUTE FILES */
import users_route_handler from './Users';

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
router.use('/users', users_route_handler);

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
    return res.status(error.status || 500).json ({
        message: error.message || "Internal Server Error"
    });
});

module.exports = router;