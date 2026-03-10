'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, MapPin, MoreVertical, Trash2, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { addressService } from '@/services/address.service';
import { GetAddressesResponse } from '@/types';

type Address = NonNullable<GetAddressesResponse['data']>[number];
type AddressList = Address[];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await addressService.getAddresses();

        if (!response.data) {
          setErrorMessage('Không tìm thấy dữ liệu địa chỉ.');
          return;
        }

        setAddresses(response.data);
      } catch {
        setErrorMessage('Không thể tải thông tin địa chỉ. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-medium">Sổ địa chỉ</h3>
          <p className="text-muted-foreground text-sm">
            Quản lý các địa chỉ giao hàng của bạn.
          </p>
        </div>
        {/* Nút này sẽ mở Dialog thêm địa chỉ */}
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Thêm địa chỉ
        </Button>
      </div>

      <div className="grid gap-4">
        {addresses.map((addr) => (
          <Card
            key={addr.addressID}
            className={addr.isDefault ? 'border-primary/50 shadow-sm' : ''}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="bg-muted mt-1 rounded-full p-2">
                    <MapPin className="text-primary h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {addr.addressName}
                      </span>
                      {addr.isDefault && (
                        <Badge variant="default" className="h-5 text-[10px]">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {addr.addressLine}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {addr.district}, {addr.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!addr.isDefault && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Thiết lập mặc định
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit2 className="h-4 w-4" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                        <Trash2 className="h-4 w-4" /> Xóa địa chỉ
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12">
          <MapPin className="text-muted-foreground mb-4 h-10 w-10" />
          <p className="text-muted-foreground">
            Bạn chưa có địa chỉ nào lưu lại.
          </p>
        </div>
      )}
    </div>
  );
}
