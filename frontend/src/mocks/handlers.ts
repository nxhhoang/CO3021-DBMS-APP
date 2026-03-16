import { addressHandlers } from './handlers/address.handler';
import { authHandlers } from './handlers/auth.handler';
import { productHandlers } from './handlers/product.handler';
import { userHandlers } from './handlers/user.handler';
import { categoryHandlers } from './handlers/category.handler';
import { cartHandlers } from './handlers/cart.handlers';

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...addressHandlers,
  ...categoryHandlers,
  ...productHandlers,
  ...cartHandlers,
];
