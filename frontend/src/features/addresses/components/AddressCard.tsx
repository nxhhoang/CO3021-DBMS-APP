'use client';

import { MapPin, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Address = {
  addressID: number;
  addressName: string;
  addressLine: string;
  city: string;
  district: string;
  isDefault: boolean;
};

interface Props {
  address: Address;
  onEdit: (addr: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: Props) {
  return (
    <Card className={address.isDefault ? 'border-primary/50 shadow-md' : ''}>
      <CardContent className="flex items-start justify-between p-6">
        <div className="flex gap-4">
          <div className="bg-primary/10 h-fit rounded-lg p-2">
            <MapPin className="text-primary h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{address.addressName}</span>
              {address.isDefault && <Badge>Mặc định</Badge>}
            </div>

            <p className="text-muted-foreground">{address.addressLine}</p>
            <p className="text-muted-foreground text-sm">
              District {address.district}, {address.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!address.isDefault && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetDefault(address.addressID)}
            >
              Đặt làm mặc định
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(address)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(address.addressID)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
