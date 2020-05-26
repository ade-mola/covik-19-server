/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

import dotenv from 'dotenv';
import { IPagination } from '../interfaces/Pagination';

dotenv.config();

class SuperController {
    constructor () {}

    async jsonize (data: any) {
        return JSON.parse(JSON.stringify({ ...data }));
    }

    determinePagination(page?: number, population?: number): IPagination {        
        if (page && !population) return { 
            skip: page 
        };
        
        if (page && population ) return {
            skip: page * population, 
            limit: population 
        };

        return {};
    }
}

export default SuperController;