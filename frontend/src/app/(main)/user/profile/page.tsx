'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { userService } from '@/services/user.service';
import type { GetProfileResponse } from '@/types';

// Định nghĩa kiểu dữ liệu thực tế bên trong lóp data
type ProfileData = NonNullable<GetProfileResponse['data']>;

const EMPTY_PROFILE: ProfileData = {
  userId: '',
  fullName: '',
  email: '',
  phoneNum: '',
  avatar: '',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        // userService.getProfile() đã return res.data (là object { message, data })
        const response = await userService.getProfile();

        // Kiểm tra đúng cấu trúc phân cấp: response.data mới là thông tin User
        if (response && response.data) {
          setProfile(response.data);
        } else {
          setErrorMessage('Không tìm thấy dữ liệu người dùng trong hệ thống.');
        }
      } catch (error: any) {
        console.error('Profile Fetch Error:', error);

        // Lấy message lỗi từ Server nếu có, nếu không dùng message mặc định
        const serverMessage = error?.response?.data?.message;
        setErrorMessage(
          serverMessage ||
            'Không thể tải thông tin người dùng. Vui lòng kiểm tra kết nối.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Tính toán Initials cho Avatar
  const initials = useMemo(() => {
    if (!profile.fullName || !profile.fullName.trim()) {
      return '?';
    }

    return profile.fullName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Chỉ lấy tối đa 2 ký tự
  }, [profile.fullName]);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* LEFT SIDE - Profile Summary */}
      <Card className="md:col-span-1">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Avatar className="h-24 w-24 text-2xl">
            {/* Nếu có avatar thì dùng Image, ở đây tạm thời dùng Fallback */}
            <AvatarFallback>{isLoading ? '...' : initials}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <p className="text-lg font-semibold">
              {isLoading ? 'Đang tải...' : profile.fullName || 'Chưa cập nhật'}
            </p>
            <p className="text-muted-foreground text-sm">
              {isLoading ? 'Đang tải...' : profile.email || 'Chưa cập nhật'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - Edit Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
          <CardDescription>Dữ liệu hồ sơ của bạn từ hệ thống.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {errorMessage ? (
            <div className="bg-destructive/15 rounded-md p-3">
              <p className="text-destructive text-sm font-medium">
                {errorMessage}
              </p>
            </div>
          ) : null}

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={profile.fullName}
                readOnly
                className={isLoading ? 'animate-pulse' : ''}
                placeholder="Họ tên người dùng"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={profile.phoneNum}
                readOnly
                className={isLoading ? 'animate-pulse' : ''}
                placeholder="Số điện thoại"
              />
            </div>

            <div className="grid gap-2">
              <Label>Email (Không thể thay đổi)</Label>
              <Input
                value={profile.email}
                disabled
                className="bg-muted cursor-not-allowed opacity-70"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t px-6 py-4">
          <Button disabled variant="outline">
            Dữ liệu đã được đồng bộ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
