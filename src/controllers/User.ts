/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import SuperController from './Super';
import * as UserModel from '../models/User';
import { IHttpResponse } from '../interfaces/HTTPRepsonse';
import ResponseUtility from '../utilities/Response';
import { IUser } from '../interfaces/User';
import { IPagination } from '../interfaces/Pagination';

class UserController extends SuperController {
    private model: any;

    constructor () {
        super();

        this.model = UserModel;
    }

    async create (data: IUser): Promise <IHttpResponse> {
        const record: any = await this.model.createRecord({ ...data });

        if (record && record._id) return ResponseUtility.processSuccessfulResponse({ ...record });
        return ResponseUtility.processFailedResponse(400, 'Could not create resource'); 
    }

    async readOne (options: any): Promise <IHttpResponse> {
        const records: Array<any> = await this.model.readRecord({ ...options});

        if (records[0]) return ResponseUtility.processSuccessfulResponse({ ...records[0]});
        return ResponseUtility.processFailedResponse(404, 'Resource not found');
    }

    async readMany (options: any, page?: number, population?: number): Promise <IHttpResponse> {
        const pagination: IPagination = this.determinePagination(page, population);
        const records: Array<any> = await this.model.readRecord({ ...options }, pagination );

        if (records.length) return ResponseUtility.processSuccessfulResponse([...records]);
        return ResponseUtility.processFailedResponse(404, 'Resource not found');
    }

    async update (options: any, data: IUser): Promise <IHttpResponse> {
        const result = await this.model.updateRecord({ ...options }, { ...data });

        if (result && result.nModified) return ResponseUtility.processSuccessfulResponse({ ...options, ...data });
        if (result && !result.nModified) return ResponseUtility.processFailedResponse(406, 'No Change.');
        return ResponseUtility.processFailedResponse(400, 'Resource not modified');
    }

    async delete (options: any): Promise<IHttpResponse> {
        const result = await this.model.deleteRecord({ ...options });

        if (result && result.nModified) return ResponseUtility.processSuccessfulResponse({});
        return ResponseUtility.processFailedResponse(400, 'Resource not modified');
    }
}

export default new UserController;