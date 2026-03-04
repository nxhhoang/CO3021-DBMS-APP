import { ApiResponse } from './api.types';

export interface Address {
  addressID: number;
  addressLine: string;
  city: string;
  district: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, 'addressID'>;

//GET /users/addresses
export type GetAddressesRequest = void;
export type GetAddressesResponse = ApiResponse<Address[]>;

//POST /users/addresses
export type CreateAddressRequest = AddressInput;
export type CreateAddressResponse = ApiResponse<
  Pick<Address, 'addressID' | 'addressLine'>
>;

//PUT /users/addresses/:addressID
export type UpdateAddressesRequest = AddressInput;
export type UpdateAddressResponse = ApiResponse<Address>;

//DELETE /users/addresses/:addressID
export type DeleteAddressRequest = void;
export type DeleteAddressResponse = ApiResponse<null>;

//PATCH /users/addresses/:addressID/set-default
export type SetDefaultAddressRequest = void;
export type SetDefaultAddressResponse = ApiResponse<null>;
