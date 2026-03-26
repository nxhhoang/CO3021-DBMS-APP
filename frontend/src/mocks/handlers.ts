import { addressHandlers } from './handlers/address.handler';
import { authHandlers } from './handlers/auth.handler';
import { productHandlers } from './handlers/product.handler';
import { userHandlers } from './handlers/user.handler';
import { categoriesHandlers } from './handlers/categories.handler';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...addressHandlers,
  ...productHandlers,
  ...categoriesHandlers,
];
