import { api, privateApi } from '../lib/axios';
import {
  GetAddressesResponse,
  UpdateAddressResponse,
  CreateAddressRequest,
  CreateAddressResponse,
  DeleteAddressResponse,
  SetDefaultAddressResponse,
} from '@/types';

export const addressService = {
  async getAddresses() {
    const res = await privateApi.get<GetAddressesResponse>('users/addresses');
    return res.data;
  },

  async createAddress(data: CreateAddressRequest) {
    const res = await privateApi.post<CreateAddressResponse>(
      'users/addresses',
      data,
    );
    return res.data;
  },

  async updateAddress(id: number, data: CreateAddressRequest) {
    const res = await privateApi.put<UpdateAddressResponse>(
      `users/addresses/${id}`,
      data,
    );
    return res.data;
  },

  async deleteAddress(id: number) {
    const res = await privateApi.delete<DeleteAddressResponse>(
      `users/addresses/${id}`,
    );
    return res.data;
  },

  async setDefaultAddress(id: number) {
    const res = await privateApi.patch<SetDefaultAddressResponse>(
      `users/addresses/${id}/set-default`,
    );
    return res.data;
  },
};

// privateApi('users/addresses'); //
// privateApi.post('users/addresses', { addressLine: '123 Main St', city: 'Hanoi', district: 'abc', isDefault: false });
// privateApi.put('users/addresses/1', { addressLine: '456 Another St'});
// privateApi.delete('users/addresses/1');
// privateApi.patch('users/addresses/2/set-default');
