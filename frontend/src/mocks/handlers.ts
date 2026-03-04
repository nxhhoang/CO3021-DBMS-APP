import { authHandlers } from './handlers/auth.handler';
import { userHandlers } from './handlers/user.handler';

export const handlers = [...authHandlers, ...userHandlers];
