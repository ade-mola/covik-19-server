import { IUser, IUserInputDTO } from '../../interfaces/User';
import { IEmail } from "../../interfaces/Email";
import { randomBytes } from 'crypto';
import { sendEmail } from '../Mailer';
import { VerificationStatus } from './enums/Verify';
import Logger from '../../utilities/Logger';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

const Token = require('../../models/Token');
const UserModel = require('../../models/User');

const jwtSecret = process.env.JWT_SECRET || '';

class AuthService {

    constructor() {}

    public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        
        try {   
        // find an existing user
        const email = userInputDTO.email;
        const existingUser = await UserModel.readRecord({email});
        Logger.info(`Attempting to signup user with email: ${email}`);
        
        if (existingUser.length > 0) {
            Logger.info(`User with email ${email} already exists`);
            throw new Error('User already exists');
        }
        
        const password_hash = await this.generatePassword(userInputDTO.password);
        const newUser : IUser = {
            email: userInputDTO.email,
            password: password_hash,
            unique_key: uuid.v4()
        };

        const userRecord = await UserModel.createRecord(newUser);
        Logger.info(`User details persisted. Generating verfication token`);

        const token: string = this.generateJWT(userRecord);
        if (!userRecord) {
            Logger.error(`Something unexpected went wrong during signup`);
            throw new Error('User cannot be created');
        }

        await this.generateAndSendVerificationToken(userRecord);

        const user = userRecord.toObject();  
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, '_id');
        Reflect.deleteProperty(user, '__v');
        
        Logger.info(`Sign up complete. User's id is ${user.unique_key}`)
        return { user, token}
    } catch (error) {
            error.status = 401
            throw error;
        }
} 

    public async verify(token: string): Promise<VerificationStatus> {

        Logger.info(`Verifying token: ${token}`)
        const savedToken = await Token.findOne({token: token});

        if(!savedToken) {
            Logger.info(`Unrecognised token: ${token}`)
            return VerificationStatus.NotVerified;
        }

        let user = await UserModel.readRecord({_id: savedToken._userId});
        
        if(user.length < 1) {
            Logger.info(`Cannot find any user associated with token: ${token}`)
            return VerificationStatus.UserNotFound;
        }
        
        user = user[0];
        Logger.info(`Verifying user with id: ${user.unique_key}`)

        if (user.isVerified) {
            Logger.info('User already verfied')
            return VerificationStatus.AlreadyVerified;
        }
        
        Logger.info('Updating user\'s verfification status to verrified')

        //could not make to use updateRecord method in UserModel. could not figure why it was throwing error:
        //fromObject toObject is not a function
        await user.updateOne({isVerified: true});
        Logger.info('Verification completed')
        return VerificationStatus.Verifed;
    }

    public async login(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        
        try {
            const email = userInputDTO.email;
            Logger.info(`Attempting login for user with email: ${email}`)
            const usersFound = await UserModel.readRecord({email});

            if (usersFound.length < 1) {
                Logger.info(`There is no account associated with email ${email}`)
                throw new Error('User does not exist')
            }

            const userRecord = usersFound[0];

            const validPassword = await this.comparePasswords(userInputDTO.password, userRecord.password);

            if (!validPassword) {
                Logger.info('Could not proceed with login due to invalid credentials')
                throw new Error('Invalid Login credentials');
            }

            if (!userRecord.isVerified) {
                Logger.info('Aborting login as user is yet to be verified')
                throw new Error('Aborting login. User is yet to be verified');
            }

            const token: string = this.generateJWT(userRecord);
            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'passwrord')

            Logger.info('Login completed')
            return { user, token };
        } catch(error) {
            Logger.error('Something went wrong during log in', error);
            error.status = 401
            throw error
        }
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
        
        Logger.info(`Generating verification token for user with id ${user.unique_key}`)
        const token = new Token({
            _userId: user._id,
            token: randomBytes(16).toString('hex')
        })
        token.save()
        Logger.info(`Successfully generated token. Sending token to user's email ${user.email}`);

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
         Logger.info('Verfication token sent!!')     
    }

    private generateJWT(user: any): string {
        Logger.info(`Generating jwt token for user id: ${user.unique_key}`)
        return jwt.sign(user.toJSON(), jwtSecret);
    }
}

export default new AuthService;