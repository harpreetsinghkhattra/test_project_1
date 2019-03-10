import { Deserializable } from './deserializable.model';
export class UserModel {
    _id: string;
    email: string;
    userType: number;
    name: string;
    category: string;
    buisness_name: string;
    mobile_number: string;
    buisness_address: string;
    status: number;
    deletedStatus: number;
    userAccessToken: string;
    salt: string;
    createdTime: number;
    updatedTime: number;
    verificationToken: string;
    verificationCode: string;
    business_name: string;
    business_address: string;
    imageUrl: string;
    address: string;
    location: Object;

    deserialize(input: any): this {
        Object.assign(this, input);
        return this;
    }
}