'use client';

import { useEffect, useMemo, useState } from 'react';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
        const response = await userService.getProfile();
        if (response && response.data) {
          setProfile(response.data);
        } else {
          setErrorMessage('Không tìm thấy dữ liệu người dùng trong hệ thống.');
        }
      } catch (error: any) {
        console.error('Profile Fetch Error:', error);
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
      .slice(0, 2);
  }, [profile.fullName]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 grid gap-8 duration-700 md:grid-cols-3">
      {/* LEFT SIDE - Profile Summary */}
      <Card className="glass-card md:col-span-1">
        <CardContent className="flex flex-col items-center gap-6 pt-12">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-2xl text-3xl">
              <AvatarFallback className="bg-slate-900 font-display font-black text-white">
                {isLoading ? '...' : initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg ring-4 ring-white">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="font-display text-xl font-black tracking-tight text-slate-900">
              {isLoading ? 'Đang tải...' : profile.fullName || 'Chưa cập nhật'}
            </h3>
            <p className="font-medium text-slate-500 italic">
              {isLoading ? 'Đang tải...' : profile.email || 'Chưa cập nhật'}
            </p>
          </div>

          <div className="w-full border-t border-slate-100 pt-6">
             <div className="flex items-center justify-between text-sm">
                <span className="font-display font-black text-slate-400 uppercase tracking-widest text-[10px]">Trạng thái</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-display text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-200/50">Đã xác thực</span>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - Edit Form */}
      <Card className="glass-card md:col-span-2">
        <CardHeader className="pb-8 pt-10">
          <div className="flex items-center gap-3">
             <div className="h-1.5 w-6 rounded-full bg-blue-600" />
             <CardTitle className="font-display text-2xl font-black tracking-tight text-slate-900">Thông tin cá nhân</CardTitle>
          </div>
          <CardDescription className="font-medium text-slate-500">Dữ liệu hồ sơ của bạn được bảo mật trong hệ thống.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          {errorMessage ? (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <p className="text-rose-600 text-sm font-bold">
                {errorMessage}
              </p>
            </div>
          ) : null}

          <div className="grid gap-8">
            <div className="grid gap-3">
              <Label htmlFor="name" className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Họ và tên</Label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <Input
                  id="name"
                  value={profile.fullName}
                  readOnly
                  className={cn(
                    "input-premium h-14 pl-12 font-medium",
                    isLoading && "animate-pulse"
                  )}
                  placeholder="Họ tên người dùng"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phone" className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Số điện thoại</Label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600">
                  <Phone size={18} strokeWidth={2.5} />
                </div>
                <Input
                  id="phone"
                  value={profile.phoneNum}
                  readOnly
                  className={cn(
                    "input-premium h-14 pl-12 font-medium",
                    isLoading && "animate-pulse"
                  )}
                  placeholder="Số điện thoại"
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="font-display text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Email (Không thể thay đổi)</Label>
              <div className="group relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} strokeWidth={2.5} />
                </div>
                <Input
                  value={profile.email}
                  disabled
                  className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 pl-12 font-medium text-slate-500 cursor-not-allowed opacity-70"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-8 border-t border-slate-100 px-8 py-6">
          <Button disabled variant="outline" className="h-12 rounded-full border-slate-200 font-display text-[11px] font-black tracking-widest text-slate-400 uppercase">
            Dữ liệu đã được đồng bộ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
