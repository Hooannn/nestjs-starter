export interface IResponse<T> {
  code?: number;
  message?: string;
  data?: T;
  success?: boolean;
}
class ResponseBuilder<T> {
  private response: Partial<IResponse<T>> = {
    code: 200,
    success: true,
    message: 'OK',
    data: null,
  };

  public code(code: number): ResponseBuilder<T> {
    this.response.code = code;
    return this;
  }
  public message(message: string): ResponseBuilder<T> {
    this.response.message = message;
    return this;
  }
  public data(data: T): ResponseBuilder<T> {
    this.response.data = data;
    return this;
  }

  public success(success: boolean): ResponseBuilder<T> {
    this.response.success = success;
    return this;
  }

  public build(): IResponse<T> {
    return this.response as IResponse<T>;
  }
}
export default ResponseBuilder;
