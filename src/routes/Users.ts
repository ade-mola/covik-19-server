/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import UserService from '../services/user/User';

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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
});

router.post('/token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId, notificationToken} = req.body
        const response = await UserService.updateUserNotificationToken(userId, notificationToken)
        if (response.success) res.status(200).send({ ...response})
        else {
            console.log(response)
        }
    } catch (error) {
        next(error);
    }
});

export default router;