import { IUser, IUserInputDTO } from '../../interfaces/User';
import { IEmail } from "../../interfaces/Email";
import { randomBytes } from 'crypto';
import { sendEmail } from '../mailer';
import { VerificationStatus } from './enums/verify';
import { mapUserToDTO } from '../mappers/UserMapper';
import { nanoid } from 'nanoid'
import Logger from '../../utilities/Logger';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const Token = require('../../models/Token');
const UserModel = require('../../models/User');

const env_vars = process.env;
const jwtSecret = env_vars.JWT_SECRET || '';

class AuthService {

    constructor() {}

    public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        
        try {   
        // find an existing user
        const email = userInputDTO.email;
        const existingUser = await UserModel.readRecord({email});
        Logger.info(`Attempting to signup user with email: ${email}`);
        
        if (existingUser[0]) {
            Logger.info(`User with email ${email} already exists`);
            throw new Error('User already exists');
        }
        
        const password_hash = await this.generatePassword(userInputDTO.password);
        const newUser : IUser = {
            email: userInputDTO.email,
            notification_token: userInputDTO.notification_token,
            password: password_hash,
            user_id: nanoid(),
        };

        const userRecord = await UserModel.createRecord(newUser);
        if (!userRecord) {
            Logger.error(`Something unexpected went wrong during signup`);
            throw new Error('User cannot be created');
        }
        Logger.info('User details persisted. Generating verfication token');

        await this.generateAndSendVerificationToken(userRecord);
        const token: string = this.generateJWT(userRecord);

        const user = userRecord.toObject();  
        mapUserToDTO(user)
        
        Logger.info(`Sign up complete. User's id is ${user.user_id}`)
        return { user, token}
    } catch (error) {
            Logger.error(error);
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
        
        if(!user[0]) {
            Logger.info(`Cannot find any user associated with token: ${token}`)
            return VerificationStatus.UserNotFound;
        }
        
        user = user[0];
        Logger.info(`Verifying user with id: ${user.user_id}`)

        if (user.is_verified) {
            Logger.info('User already verfied')
            return VerificationStatus.AlreadyVerified;
        }
        
        Logger.info('Updating user\'s verfification status to verified')

        TODO: 'make use of update record model in the UserModel class'
        //could not make to use updateRecord method in UserModel. could not figure why it was throwing error:
        //fromObject toObject is not a function
        await user.updateOne({is_verified: true});
        Logger.info('Verification completed')
        return VerificationStatus.Verifed;
    }

    public async login(userInputDTO: IUserInputDTO): Promise<{ user: IUser; token: string }> {
        try {
            const email = userInputDTO.email;
            Logger.info(`Attempting login for user with email: ${email}`)
            const usersFound = await UserModel.readRecord({email});

            if (!usersFound[0]) {
                Logger.info(`There is no account associated with email ${email}`)
                throw new Error('User does not exist')
            }

            const userRecord = usersFound[0];

            const validPassword = await this.comparePasswords(userInputDTO.password, userRecord.password);

            if (!validPassword) {
                Logger.info('Could not proceed with login due to invalid credentials')
                throw new Error('Invalid Login credentials');
            }

            if (!userRecord.is_verified) {
                Logger.info('Aborting login as user is yet to be verified')
                throw new Error('Aborting login. User is yet to be verified');
            }

            const token: string = this.generateJWT(userRecord);
            const user = userRecord.toObject();
            mapUserToDTO(user)

            Logger.info('Login completed')
            return { user, token };
        } catch(error) {
            Logger.error('Something went wrong during log in. ', error);
            error.status = 401
            throw error
        }
    }

    public async resendToken(email: string): Promise<boolean> {

        try {
            Logger.info(`Attempting to resend verification token to  ${email}`);
            let user = await UserModel.readRecord({ email })
            
            if (!user[0]) {
                Logger.info(`There is no account associated with email ${email}. Not sending verification token.`)
                throw new Error('We were unable to find a user with that email')
            }

            user = user[0] as IUser

            if(user.is_verified) {
                Logger.info(`The account associated with the provided email has already been verified`)
                return false
            }

            await this.generateAndSendVerificationToken(user);
            return true
        } catch(error) {
            error.status = 400
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

    private async generateAndSendVerificationToken(user: IUser) {
        
        Logger.info(`Generating verification token for user with id ${user.user_id}`)
        const token = new Token({
            _userId: user._id,
            token: randomBytes(16).toString('hex')
        })
        token.save()
        Logger.info(`Successfully generated token. Sending token to user's email ${user.email}`);

        const env_vars = process.env
        const host = env_vars.HOST || `http://localhost:${process.env.APP_PORT}`;
        const from_email = env_vars.SENDGRID_EMAIL || "default_email"

        // send verification email
          const email: IEmail = {
            to: user.email,
            from: from_email,
            subject: "Email Verification",
            text: "Some uselss text",
            html: `<p>Please verify your account by clicking the link: 
            <a href="${host}/users/auth/verify?token=${token.token}">Click here to verify your account</a> </p>` 
          };

         await sendEmail(email); 
         Logger.info('Verfication token sent!!')     
    }

    private generateJWT(user: any): string {
        Logger.info(`Generating jwt token for user id: ${user.user_id}`)
        return jwt.sign(user.toJSON(), jwtSecret);
    }
}

export default new AuthService;