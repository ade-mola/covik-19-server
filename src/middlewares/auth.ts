import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Logger from '../utilities/Logger';

const jwtSecret = process.env.JWT_SECRET || '';
export function requireAuth(req: Request, res: Response, next: NextFunction) {
        
    if (!req.headers || !req.headers.authorization){
        Logger.info('Failed authorization due to no header')
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    

    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        Logger.info('Failed authorization due to malformed token')
        return res.status(401).send({ message: 'Malformed token.' });
    }
    
    const token = token_bearer[1];

    return jwt.verify(token, jwtSecret, (err: any) => {
      if (err) {
        Logger.info('Failed authorization due to incorrect token')
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      return next();
    });
}