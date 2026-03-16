'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddresses } from '@/features/addresses/hooks/useAddresses';
import AddressList from '@/features/addresses/components/AddressList';
import AddressFormDialog from '@/features/addresses/components/AddressFormDialog';

export default function AddressesPage() {
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  const emptyAddress = {
    addressName: '',
    addressLine: '',
    city: '',
    district: '',
    isDefault: false,
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyAddress);

  const handleUpdate = async () => {
    if (editingAddressId) {
      await updateAddress(editingAddressId, formData);
    } else {
      await createAddress(formData);
    }

    setFormData(emptyAddress);
    setOpenDialog(false);
  };

  const handleEdit = (addr: any) => {
    setEditingAddressId(addr.addressID);
    setFormData(addr);
    setOpenDialog(true);
  };
  const handleAdd = () => {
    setEditingAddressId(null);
    setFormData(emptyAddress);
    setOpenDialog(true);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sổ địa chỉ</h2>
          <p className="text-muted-foreground">
            Quản lý các địa chỉ giao hàng của bạn.
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm địa chỉ
        </Button>
      </div>

      <AddressList
        addresses={addresses}
        onEdit={handleEdit}
        onDelete={deleteAddress}
        onSetDefault={setDefaultAddress}
      />

      <AddressFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        formData={formData}
        setFormData={setFormData}
        editingAddressId={editingAddressId}
        onSubmit={handleUpdate}
      />
    </div>
  );
}