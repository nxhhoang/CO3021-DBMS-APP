"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { ObjectId } from 'mongodb'
const commons_1 = require("../utils/commons");
// import { UserVerifyStatus } from '../constants/enums'
const Errors_1 = require("../models/Errors");
// import { USERS_MESSAGES } from '../constants/messages'
const httpStatus_1 = __importDefault(require("../constants/httpStatus"));
const socket_io_1 = require("socket.io");
const initSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000'
        }
    });
    const users = {};
    io.use(async (socket, next) => {
        const { Authorization } = socket.handshake.auth;
        const access_token = Authorization?.split(' ')[1];
        try {
            const decoded_authorization = await (0, commons_1.verifyAccessToken)(access_token);
            if (!decoded_authorization) {
                throw new Errors_1.ErrorWithStatus({
                    message: 'Unauthorized',
                    status: httpStatus_1.default.UNAUTHORIZED
                });
            }
            socket.handshake.auth.decoded_authorization = decoded_authorization;
            socket.handshake.auth.access_token = access_token;
            next();
        }
        catch (error) {
            next({
                message: 'Unauthorized',
                name: 'UnauthorizedError',
                data: error
            });
        }
    });
    io.on('connection', (socket) => {
        console.log(`user ${socket.id} connected`);
        const { user_id } = socket.handshake.auth.decoded_authorization;
        users[user_id] = { socket_id: socket.id };
        socket.use(async (packet, next) => {
            const { access_token } = socket.handshake.auth;
            try {
                await (0, commons_1.verifyAccessToken)(access_token);
                next();
            }
            catch (error) {
                console.error(error);
                next(new Error('Unauthorized'));
            }
        });
        socket.on('error', (error) => {
            if (error.message === 'Unauthorized') {
                socket.disconnect();
            }
        });
        socket.on('disconnect', () => {
            delete users[user_id];
            console.log(`user ${socket.id} disconnected`);
        });
    });
};
exports.default = initSocket;
