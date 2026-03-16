import { useEffect, useState } from 'react';
import { addressService } from '@/services/address.service';
import { GetAddressesResponse } from '@/types';
import { toast } from 'sonner';

type Address = NonNullable<GetAddressesResponse['data']>[number];

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const res = await addressService.getAddresses();
      if (res.data) setAddresses(res.data);
    } catch {
      toast.error('Không thể tải danh sách địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const createAddress = async (data: Omit<Address, 'addressID'>) => {
    await addressService.createAddress(data);
    toast.success('Thêm địa chỉ thành công');
    fetchAddresses();
  };

  const updateAddress = async (
    id: number,
    data: Omit<Address, 'addressID'>,
  ) => {
    await addressService.updateAddress(id, data);
    toast.success('Cập nhật thành công');
    fetchAddresses();
  };

  const deleteAddress = async (id: number) => {
    await addressService.deleteAddress(id);
    setAddresses((prev) => prev.filter((a) => a.addressID !== id));
    toast.success('Đã xóa địa chỉ');
  };

  const setDefaultAddress = async (id: number) => {
    await addressService.setDefaultAddress(id);
    toast.success('Đã cập nhật mặc định');
    fetchAddresses();
  };

  return {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch: fetchAddresses,
  };
}
