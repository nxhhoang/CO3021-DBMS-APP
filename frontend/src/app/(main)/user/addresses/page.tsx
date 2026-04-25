'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from '@/types';
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

  const handleEdit = (addr: Address) => {
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
    <div className="animate-in fade-in slide-in-from-bottom-8 space-y-10 duration-700">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
           <div className="flex items-center gap-3">
             <div className="h-1.5 w-6 rounded-full bg-blue-600" />
             <h2 className="font-display text-2xl font-black tracking-tight text-slate-900">Sổ địa chỉ</h2>
          </div>
          <p className="mt-1 font-medium text-slate-500">
            Quản lý các địa chỉ giao hàng của bạn.
          </p>
        </div>

        <Button 
          onClick={handleAdd}
          className="h-14 rounded-full bg-slate-900 px-8 font-display text-[11px] font-black tracking-[0.2em] text-white uppercase transition-all hover:scale-[1.05] active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} />
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