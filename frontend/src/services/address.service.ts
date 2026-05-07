import { privateApi } from '../lib/axios'
import {
  Address,
  GetAddressesResponse,
  UpdateAddressResponse,
  CreateAddressRequest,
  CreateAddressResponse,
  DeleteAddressResponse,
  SetDefaultAddressResponse,
} from '@/types'

type RawAddress = Partial<Address> & {
  addressid?: number
  addressname?: string
  addressline?: string
  isdefault?: boolean
}

const normalizeAddress = (address: RawAddress): Address => ({
  addressID: address.addressID ?? address.addressid ?? 0,
  addressName: address.addressName ?? address.addressname ?? '',
  addressLine: address.addressLine ?? address.addressline ?? '',
  city: address.city ?? '',
  district: address.district ?? '',
  isDefault: address.isDefault ?? address.isdefault ?? false,
})

export const addressService = {
  async getAddresses() {
    const res = await privateApi.get<GetAddressesResponse>('users/addresses')
    const normalizedData = (res.data.data ?? []).map((address) =>
      normalizeAddress(address as RawAddress),
    )

    return {
      ...res.data,
      data: normalizedData,
    }
  },

  async createAddress(data: CreateAddressRequest) {
    const res = await privateApi.post<CreateAddressResponse>(
      'users/addresses',
      data,
    )
    return res.data
  },

  async updateAddress(id: number, data: CreateAddressRequest) {
    const res = await privateApi.put<UpdateAddressResponse>(
      `users/addresses/${id}`,
      data,
    )
    return res.data
  },

  async deleteAddress(id: number) {
    const res = await privateApi.delete<DeleteAddressResponse>(
      `users/addresses/${id}`,
    )
    return res.data
  },

  async setDefaultAddress(id: number) {
    const res = await privateApi.patch<SetDefaultAddressResponse>(
      `users/addresses/${id}/set-default`,
    )
    return res.data
  },
}

// privateApi('users/addresses'); //
// privateApi.post('users/addresses', { addressLine: '123 Main St', city: 'Hanoi', district: 'abc', isDefault: false });
// privateApi.put('users/addresses/1', { addressLine: '456 Another St'});
// privateApi.delete('users/addresses/1');
// privateApi.patch('users/addresses/2/set-default');
