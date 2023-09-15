"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseBuilder {
    constructor() {
        this.response = {
            code: 200,
            success: true,
            message: 'OK',
            data: null,
        };
    }
    code(code) {
        this.response.code = code;
        return this;
    }
    message(message) {
        this.response.message = message;
        return this;
    }
    data(data) {
        this.response.data = data;
        return this;
    }
    success(success) {
        this.response.success = success;
        return this;
    }
    build() {
        return this.response;
    }
}
exports.default = ResponseBuilder;
//# sourceMappingURL=response.js.map