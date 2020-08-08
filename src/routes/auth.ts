import express, { Router, Response, Request, NextFunction } from "express";
import { celebrate, errors } from 'celebrate';
import { IHttpResponse } from "../interfaces/HTTPRepsonse";
import { IUserInputDTO } from "../interfaces/User";
import { UserSchema, TokenSchema, EmailSchema } from './Validation'
import { requireAuth } from "../middlewares/auth";
import AuthController from '../controllers/Auth'

const router: Router = express.Router();

router.use(errors())

router.post(
    '/signUp', celebrate({ body: UserSchema }),

    async(req: Request, res: Response, next: NextFunction) => {
        try {
            const response: IHttpResponse = await AuthController.signUp(req.body as IUserInputDTO)
            if (response.success) res.status(201).send({ ...response})
            else res.status(response.error.code).send({ ...response})
        } catch(error) {
            next(error)
        }
});

router.post(
    '/login', requireAuth,  celebrate({ body: UserSchema }),     
    
    async(req: Request, res: Response, next: NextFunction) => {
        try {
            const response: IHttpResponse = await AuthController.login(req.body as IUserInputDTO)
            if (response.success) res.status(200).send({ ...response})
            else res.status(response.error.code).send({ ...response}) 
        } catch(error) {
            next(error)
        }
});

router.get(
    '/verify', celebrate({ query: TokenSchema }),
      
    async(req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.token as string
            const response: IHttpResponse = await AuthController.verifyUser(token)
            if (response.success) res.status(200).send({ ...response})
            else res.status(response.error.code).send({ ...response})  
        } catch(error) {
            next(error)
        }

});

router.post(
    '/resendToken', celebrate({ query: EmailSchema }),
      
    async(req: Request, res: Response, next: NextFunction) => {
        try {
            const email = req.query.email as string
            const response: IHttpResponse = await AuthController.resendToken(email)
            if (response.success) res.status(200).send({ ...response})
            else res.status(response.error.code).send({ ...response})  
        } catch(error) {
            next(error)
        }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send({
            success: true,
            error: null,
            payload: 'auth endpoint'
        })
    } catch(error) {
        next(error)
    }
});

export default router