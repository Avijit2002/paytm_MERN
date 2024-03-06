"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successApiResponse = void 0;
function successApiResponse(responseStatus, data) {
    return (res) => {
        res.status(responseStatus).json({
            message: "User created successfully",
            data
        });
    };
}
exports.successApiResponse = successApiResponse;
