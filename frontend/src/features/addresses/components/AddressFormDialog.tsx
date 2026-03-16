'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formData: any;
  setFormData: any;
  editingAddressId: number | null;
  onSubmit: () => void;
}

export default function AddressFormDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  editingAddressId,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingAddressId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Tên địa chỉ</Label>
            <Input
              value={formData.addressName}
              onChange={(e) =>
                setFormData({ ...formData, addressName: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Địa chỉ</Label>
            <Input
              value={formData.addressLine}
              onChange={(e) =>
                setFormData({ ...formData, addressLine: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quận/Huyện</Label>
              <Input
                value={formData.district}
                onChange={(e) =>
                  setFormData({ ...formData, district: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Thành phố</Label>
              <Input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
