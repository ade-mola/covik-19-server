import SuperController from "./Super";
import AuthService from "../services/auth/Auth"
import ResponseUtility from '../utilities/Response';
import { IHttpResponse } from "../interfaces/HTTPRepsonse";
import { IUserInputDTO, IUser } from "../interfaces/User";
import { VerificationStatus } from "../services/auth/enums/Verify";


class AuthController extends SuperController {

    private authService: any
    
    constructor() {
        super();
        this.authService = AuthService
    }

    async signUp(userInputDTO: IUserInputDTO): Promise<IHttpResponse> {
        const user: IUser = await this.authService.signUp(userInputDTO)

        if(!user) return ResponseUtility.processFailedResponse(409, `User with email ${userInputDTO.email} already exists`);
        return ResponseUtility.processSuccessfulResponse({ ...user})
    }

    async login(userInputDTO: IUserInputDTO): Promise<IHttpResponse> {
        const user: IUser = await this.authService.login(userInputDTO)

        if (!user) return ResponseUtility.processFailedResponse(401, 'Invalid login credentials or user has not been verified');
        return ResponseUtility.processSuccessfulResponse({ ...user})
    }

    async verifyUser(token: string): Promise<IHttpResponse> {
        const status: VerificationStatus = await this.authService.verify(token);
        switch(status) {
            case VerificationStatus.AlreadyVerified:
                return ResponseUtility.processFailedResponse(400, status.valueOf())
            case VerificationStatus.NotVerified:
                return ResponseUtility.processFailedResponse(400, 'User not verified. Incorrect or Expired Token!!')    
            case VerificationStatus.UserNotFound:
                return ResponseUtility.processFailedResponse(401, 'No user associated with the provided token')
            default:
                return ResponseUtility.processSuccessfulResponse(status.valueOf())     
        }
    }

    async resendToken(email: string): Promise<IHttpResponse> {
        const sent = await this.authService.resendToken(email);
        if (!sent) {
            return ResponseUtility.processFailedResponse(400, 'The associated account has already been verfied')
        }
        return ResponseUtility.processSuccessfulResponse(`Verification token has been sent to ${email}`)
    }
}

export default new AuthController