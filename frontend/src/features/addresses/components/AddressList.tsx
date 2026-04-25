'use client'

import { AddressCard } from './AddressCard'

interface Props {
  addresses: any[]
  onEdit: (addr: any) => void
  onDelete: (id: number) => void
  onSetDefault: (id: number) => void
}

export function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <div className="grid gap-4">
      {addresses.map((addr) => (
        <AddressCard
          key={addr.addressID}
          address={addr}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  )
}
