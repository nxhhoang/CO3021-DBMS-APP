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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { userAgent } from 'next/server';

export default function ProfilePage() {
  // Giả định dữ liệu fetch từ API GET /users/profile
  const user = {
    fullName: 'Nguyen Van B',
    email: 'vanb@example.com',
    phoneNum: '0987654321',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nguyen Van B',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>
            Cập nhật ảnh đại diện và thông tin cơ bản của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Button variant="outline" size="sm">
                Thay đổi ảnh
              </Button>
              <p className="text-muted-foreground text-xs">
                JPG, PNG tối đa 2MB.
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Section */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email (Không thể thay đổi)</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                defaultValue={user.fullName}
                placeholder="Nhập họ tên của bạn"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                defaultValue={user.phoneNum}
                placeholder="Nhập số điện thoại"
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
