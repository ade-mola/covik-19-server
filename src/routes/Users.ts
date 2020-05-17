/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import express, { Request, Response, Router, NextFunction } from 'express';
import auth_route_handler from './auth';

const router: Router = express.Router();

router.use('/auth', auth_route_handler);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
});

router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        next(error);
    }
});

export default router;