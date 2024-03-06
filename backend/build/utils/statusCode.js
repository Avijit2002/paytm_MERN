"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseStatus = void 0;
var responseStatus;
(function (responseStatus) {
    responseStatus[responseStatus["success"] = 200] = "success";
    responseStatus[responseStatus["incorrectInput"] = 401] = "incorrectInput";
    responseStatus[responseStatus["internalServerError"] = 500] = "internalServerError";
    responseStatus[responseStatus["unauthorized"] = 403] = "unauthorized";
})(responseStatus || (exports.responseStatus = responseStatus = {}));
