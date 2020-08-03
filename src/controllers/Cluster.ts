/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import SuperController from './Super';
import * as ClusterModel from '../models/Cluster';
import { IHttpResponse } from '../interfaces/HTTPRepsonse';
import ResponseUtility from '../utilities/Response';
import { ICluster } from '../interfaces/Cluster';
import { IPagination } from '../interfaces/Pagination';

class ClusterController extends SuperController {
    private model: any;

    constructor () {
        super();

        this.model = ClusterModel;
    }

    async create (data: ICluster): Promise <IHttpResponse> {
        const record: any = await this.model.createRecord({ ...data });

        if (record && record._id) return ResponseUtility.processSuccessfulResponse({ ...record });
        return ResponseUtility.processFailedResponse(400, 'Could not create resource'); 
    }

    async readOne (options: any): Promise <IHttpResponse> {
        const record = await this.model.readRecord({ ...options});

        if (record[0]) return ResponseUtility.processSuccessfulResponse(record['0']);
        return ResponseUtility.processFailedResponse(404, 'Resource not found');
    }

    async readMany (options: any, page?: number, population?: number): Promise <IHttpResponse> {
        const pagination: IPagination = this.determinePagination(page, population);
        const records: Array<any> = await this.model.readRecord({ ...options }, pagination );

        if (records.length) return ResponseUtility.processSuccessfulResponse([...records]);
        return ResponseUtility.processFailedResponse(404, 'Resource not found');
    }

    async update (options: any, data: ICluster): Promise <IHttpResponse> {
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

export default new ClusterController;