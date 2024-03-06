"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncFunction = void 0;
//import { User } from './user.model'; // Assuming your user model is named 'user.model'
function asyncFunction(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(err => next(err));
    };
}
exports.asyncFunction = asyncFunction;
;
// 
// 
