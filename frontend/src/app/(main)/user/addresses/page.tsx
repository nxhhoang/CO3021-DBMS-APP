'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Address } from '@/types'
import {
  useAddresses,
  AddressList,
  AddressFormDialog,
} from '@/features/addresses'


export default function AddressesPage() {
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses()

  const emptyAddress = {
    addressName: '',
    addressLine: '',
    city: '',
    district: '',
    isDefault: false,
  }

  const [openDialog, setOpenDialog] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyAddress)

  const handleUpdate = async () => {
    if (editingAddressId) {
      await updateAddress(editingAddressId, formData)
    } else {
      await createAddress(formData)
    }

    setFormData(emptyAddress)
    setOpenDialog(false)
  }

  const handleEdit = (addr: Address) => {
    setEditingAddressId(addr.addressID)
    setFormData(addr)
    setOpenDialog(true)
  }
  const handleAdd = () => {
    setEditingAddressId(null)
    setFormData(emptyAddress)
    setOpenDialog(true)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-4 rounded-full bg-slate-900" />
          <h4 className="font-display text-[13px] font-black tracking-tight text-slate-900 uppercase">
            Sổ địa chỉ
          </h4>
        </div>
        <Button
          onClick={handleAdd}
          className="font-display h-9 rounded-xl bg-slate-900 px-5 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-blue-600 active:scale-95"
        >
          <Plus className="mr-2 h-3.5 w-3.5" strokeWidth={3} />
          Thêm mới
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
  )
}
