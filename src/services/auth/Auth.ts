import { IUser, IUserInputDTO } from '../../interfaces/User';
import { IEmail } from "../../interfaces/Email";
import { randomBytes } from 'crypto';
import { sendEmail } from '../mailer';
import { VerificationStatus } from './enums/verify';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import Logger from '../../utilities/Logger';
import { NextFunction, Request, Response } from 'express';

const Token = require('../../models/Token');
const UserModel = require('../../models/User');

const jwtSecret = process.env.JWT_SECRET || '';

class AuthService {

    constructor() {}

    public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        
        try {   
        // find an existing user
        const existingUser = await UserModel.readRecord({email: userInputDTO.email});
        
        if (existingUser.length > 0) {
            Logger.info(`User with email ${existingUser[0].email} already exists`);
            throw new Error('User already exists');
        }
        const password_hash = await this.generatePassword(userInputDTO.password);
        const newUser : IUser = {
            email: userInputDTO.email,
            password: password_hash,
            unique_key: uuid.v4()
        };

        console.log("persisting ")
        const userRecord = await UserModel.createRecord(newUser);
        const token: string = this.generateJWT(userRecord);

        if (!userRecord) {
            throw new Error('User cannot be created');
        }
        console.log("Successful creation")
        
        await this.generateAndSendVerificationToken(userRecord);

        const user = userRecord.toObject();  
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, '_id');
        Reflect.deleteProperty(user, '__v');
        Logger.info(`Token is ${token}`)
        console.log({...user})
        return { user, token}
    } catch (e) {
            //log error
            throw e;
        }
} 

    public async verify(token: string): Promise<VerificationStatus> {
        const savedToken = await Token.findOne({token: token});

        Logger.info(savedToken._userId)

        if(!savedToken) {
            return VerificationStatus.NotVerified;
        }

        let user = await UserModel.readRecord({_id: savedToken._userId});
        
        if(user.length < 1) {
            return VerificationStatus.UserNotFound;
        }
        
        user = user[0];

        if (user.isVerified) {
            return VerificationStatus.AlreadyVerified;
        }
        
        Logger.info(`attempting update`)

        //could not make to use updateRecord in UserModel
        const updateUser = await user.updateOne({isVerified: true});
        Logger.info(`Update completed ${updateUser}`)
        return VerificationStatus.Verifed;
    }

    public async login(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        const usersFound = await UserModel.readRecord({email: userInputDTO.email});

        Logger.info(`existing user is ${usersFound.length}`);

        if (usersFound.length < 1) {
            throw new Error('User does not exist')
        }

        const userRecord = usersFound[0];

        const validPassword = await this.comparePasswords(userInputDTO.password, userRecord.password);

        if (!validPassword) {
            throw new Error('Invalid Login credentials');
        }

        if (!userRecord.isVerified) {
            throw new Error('User is yet to be verified');
        }

        const token: string = this.generateJWT(userRecord);
        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'passwrord')
        return { user, token };
    }

    public requireAuth(req: Request, res: Response, next: NextFunction) {
        if (!req.headers || !req.headers.authorization){
            return res.status(401).send({ message: 'No authorization headers.' });
        }
        
    
        const token_bearer = req.headers.authorization.split(' ');
        if(token_bearer.length != 2){
            return res.status(401).send({ message: 'Malformed token.' });
        }
        
        const token = token_bearer[1];
    
        return jwt.verify(token, jwtSecret, (err: any) => {
          if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
          }
          return next();
        });
    }   

    private async generatePassword(plainTextPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(plainTextPassword, salt);
        return hash;
    }

    private async comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hash);
    }

    private async generateAndSendVerificationToken(user: any) {
        
        const token = new Token({
            _userId: user._id,
            token: randomBytes(16).toString('hex')
        })

        token.save()

        const host = process.env.HOST || `http://localhost:${process.env.APP_PORT}`;

        // send verification email
          const email: IEmail = {
            to: user.email,
            from: "oaadeoye14@student.lautech.edu.ng",
            subject: "Email Verification",
            text: "Some uselss text",
            html: `<p>Please verify your account by clicking the link: 
            <a href="${host}/users/auth/verify?token=${token.token}">${host}/users/auth/verify?token=${token.token}</a> </p>` 
          };

         await sendEmail(email);      
    }

    private generateJWT(user: any): string {
        return jwt.sign(user.toJSON(), jwtSecret);
    }
}

export default new AuthService;