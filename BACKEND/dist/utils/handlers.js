"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRequestHandler = void 0;
const wrapRequestHandler = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};
exports.wrapRequestHandler = wrapRequestHandler;
