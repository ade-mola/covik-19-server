/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/

export interface IUser {
    _id?: any;
    email: string;
    password: string;
    unique_key?: string;
    is_active?: boolean;
    is_deleted?: boolean
}