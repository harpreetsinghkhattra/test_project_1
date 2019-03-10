export interface Response<T> {
    code: number;
    status: number;
    data: T;
    message: string;
    emptyKeys: Error[];
    error: boolean;
}

export interface Error {
    fieldName: string;
    message: string;
}
