/**
 * @author EDC: Oguntuberu Nathan O. <nateoguns.work@gmail.com>
*/
export interface IUser {
    _id?: any;
    email: string;
    password: string;
    user_id: string;
    is_active?: boolean;
    is_deleted?: boolean
    is_verified?: boolean
}

export interface IUserInputDTO {
    email: string;
    password: string;
  }
