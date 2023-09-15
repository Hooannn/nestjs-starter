export interface IResponse<T> {
    code?: number;
    message?: string;
    data?: T;
    success?: boolean;
}
declare class ResponseBuilder<T> {
    private response;
    code(code: number): ResponseBuilder<T>;
    message(message: string): ResponseBuilder<T>;
    data(data: T): ResponseBuilder<T>;
    success(success: boolean): ResponseBuilder<T>;
    build(): IResponse<T>;
}
export default ResponseBuilder;
