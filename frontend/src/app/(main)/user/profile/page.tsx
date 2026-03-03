import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  // Giả định dữ liệu fetch từ API GET /users/profile
  const user = {
    fullName: 'Nguyen Van B',
    email: 'vanb@example.com',
    phoneNum: '0987654321',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin cơ bản của bạn.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {/* 1. Đưa Họ và tên lên vị trí đầu tiên */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">
                Họ và tên
              </Label>
              <Input
                id="name"
                defaultValue={user.fullName}
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            {/* 2. Số điện thoại */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                defaultValue={user.phoneNum}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* 3. Email (Thường để dưới cùng nếu disabled vì ít quan trọng trong việc chỉnh sửa) */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email (Không thể thay đổi)</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted opacity-70"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t px-6 py-4">
          <Button>Lưu thay đổi</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
