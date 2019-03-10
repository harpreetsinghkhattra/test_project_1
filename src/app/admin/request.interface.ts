/** Login request object keys*/
export interface LoginRequest {
    email: string;
    password: string;
}

/** Forget Password request object keys*/
export interface ForgetPasswordRequest {
    email: string;
}

/** Get user */
export interface GetUserRequest {
    id: string;
    accessToken: string;
}

/** Get all users */
export interface GetAllUsersRequest {
    id: string;
    accessToken: string;
}

/** Get admin users and products count */
export interface GetHomeAdminData {
    id: string;
    accessToken: string;
}

/** Get blocked users */
export interface GetBlockedUsers {
    id: string;
    accessToken: string;
}

/** Block user */
export interface BlockUser {
    id: string;
    accessToken: string;
    userId: string;
}

/** Send push notification */
export interface SendNotificationRequest {
    id: string;
    accessToken: string;
    title: string;
    description: string;
}

/** Upload images */
export interface UploadImagesRequest {
    id: string;
    accessToken: string;
    images: any[];
}

/** Edit user request */
export interface EditUserRequest {
    uid: string;
    name: string;
    phone: string;
    email: string;
    status: string;
}

/** Reset password */
export interface ResetPasswordRequest {
    email: string;
    password: string;
}

/** Logout */
export interface LogoutRequest {
    id: string;
    accessToken: string;
}

export interface RefundBookingAmount {
    id: string;
    accessToken: string;
    transactionId: string;
    bookingId: string;
    customerPaymentProfileId: string;
    customerProfileId: string;
    cost: number;
}

export interface AddPackage {
    price: string;
    duration: string;
    nameOfPackage: string;
    discount: string;
    detail: string;
}

export interface UpdatePackage {
    price: string;
    duration: string;
    pid: string;
    discount: string;
    detail: string;
}

export interface DeletePackage {
    pid: string;
}

export interface SetCommissionRate {
    uid: string;
    commissionRate: string;
}

export interface PreRegisterEmail {
    email: string;
}

export interface CancelSubscription {
    id: string;
    accessToken: string;
    uid: string;
    subscriptionId: number;
}

export interface FinancialReportRequest {
    from: string;
    to: string;
}
