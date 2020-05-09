/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import { IHttpResponse } from '../interfaces/HTTPRepsonse';

class HttpResponseUtility {

    constructor () {}
    
    processSuccessfulResponse( data: any ): IHttpResponse {
        return {
            success: true,
            error: null,
            payload: data
        }
    }

    processFailedResponse( code: number, message: string) :IHttpResponse {
        return {
            success: false,
            error: {
                code,
                message
            },
            payload: null
        }
    }
}

export default new HttpResponseUtility;