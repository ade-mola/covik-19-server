/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import express, { Request, Response, Router, NextFunction } from 'express';
import { requireAuth } from "../middlewares/auth";
const router: Router = express.Router();

import ClusterTrackerService from '../services/cluster/tracker';
import { IClusterInfo } from '../interfaces/Cluster';
import { ITestResult } from '../interfaces/TestResult';
import { NewClusterSchema, TestResultSchema } from './Validation';
import { celebrate } from 'celebrate';

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.send({
            success: true,
            error: null,
            payload: 'cluster endpoint'
        })
    } catch (error) {
        next(error)
    }
});

router.post('/result', requireAuth, celebrate({ body: TestResultSchema }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await ClusterTrackerService.processTestResult(req.body as ITestResult)
        if (response.success) res.status(200).send({ ...response })
        else res.status(response.error.code).send({ ...response })
    } catch (error) {
        next(error);
    }
});

router.post('/', requireAuth, celebrate({ body: NewClusterSchema }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await ClusterTrackerService.createorUpdateCluster(req.body as IClusterInfo)
        if (response.success) res.status(200).send({ ...response })
        else {
            console.log(response)
            res.status(response.error.code).send({ ...response })
        }
    } catch (error) {
        next(error);
    }
});

export default router;