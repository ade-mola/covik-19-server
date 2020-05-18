/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import express, { Request, Response, Router, NextFunction } from 'express';
const router: Router = express.Router();

import ClusterTrackerService from '../services/cluster/tracker';

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error);
    }
});

router.post('/result', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.json( await ClusterTrackerService.processTestResult(req.body));
    } catch (error) {
        next(error);
    }
});

export default router;