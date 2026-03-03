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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ProfilePage() {
  const user = {
    fullName: 'Nguyen Van B',
    email: 'vanb@example.com',
    phoneNum: '0987654321',
    role: 'ADMIN',
  };

  const initials = user.fullName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* LEFT SIDE - Profile Summary */}
      <Card className="md:col-span-1">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Avatar className="h-24 w-24 text-2xl">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <p className="text-lg font-semibold">{user.fullName}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <p className="bg-muted mt-2 inline-block rounded-full px-3 py-1 text-xs">
              {user.role}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - Edit Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin cơ bản của bạn.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6">
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

            <div className="grid gap-2">
              <Label>Email (Không thể thay đổi)</Label>
              <Input
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
