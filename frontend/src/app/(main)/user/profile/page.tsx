'use client';

import { useEffect, useMemo, useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Edit2, Save, X, Loader2 } from 'lucide-react';
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
  const [tempProfile, setTempProfile] = useState<ProfileData>(EMPTY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await userService.getProfile();
      if (response && response.data) {
        setProfile(response.data);
        setTempProfile(response.data);
      } else {
        setErrorMessage('Không tìm thấy dữ liệu người dùng.');
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Không thể tải thông tin người dùng.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsUpdating(true);
    setErrorMessage(null);
    try {
      await userService.updateProfile({
        fullName: tempProfile.fullName,
        phoneNum: tempProfile.phoneNum,
      });
      setProfile({ ...profile, ...tempProfile });
      setIsEditing(false);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
    setErrorMessage(null);
  };

  const initials = useMemo(() => {
    if (!profile.fullName || !profile.fullName.trim()) return '?';
    return profile.fullName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [profile.fullName]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 grid gap-8 duration-700 lg:grid-cols-3">
      {/* LEFT SIDE - Profile Summary */}
      <Card className="glass-card border-none bg-white/50 shadow-xl lg:col-span-1">
        <CardContent className="flex flex-col items-center gap-6 pt-12 pb-10">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse bg-blue-500/20 blur-2xl rounded-full" />
            <Avatar className="relative h-32 w-32 border-4 border-white shadow-2xl">
              <AvatarFallback className="bg-slate-900 font-display text-2xl font-black text-white">
                {isLoading ? '...' : initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-1.5 text-center">
            <h3 className="font-display text-2xl font-black tracking-tight text-slate-900">
              {isLoading ? 'Đang tải...' : profile.fullName || 'Chưa cập nhật'}
            </h3>
            <p className="font-medium text-slate-500">
              {isLoading ? 'Đang tải...' : profile.email || 'Chưa cập nhật'}
            </p>
          </div>

          <div className="mt-4 flex w-full flex-col gap-3 rounded-2xl bg-slate-50/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loại tài khoản</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Khách hàng thân thiết</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thành viên từ</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">2024</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RIGHT SIDE - Edit Form */}
      <Card className="glass-card border-none bg-white/50 shadow-xl lg:col-span-2">
        <CardHeader className="px-8 pb-8 pt-10 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="font-display text-2xl font-black tracking-tight text-slate-900">
              Thông tin cá nhân
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              Quản lý thông tin tài khoản và cài đặt bảo mật của bạn.
            </CardDescription>
          </div>
          {!isEditing && !isLoading && (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline" 
              className="h-10 rounded-xl border-blue-100 bg-blue-50/50 px-4 font-display text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Edit2 size={14} className="mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </CardHeader>

        <CardContent className="space-y-8 px-8">
          {errorMessage && (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <p className="text-sm font-bold text-rose-600">{errorMessage}</p>
            </div>
          )}

          <div className="grid gap-8 sm:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Họ và tên
              </Label>
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
                <Input
                  id="fullName"
                  value={isEditing ? tempProfile.fullName || '' : profile.fullName || ''}
                  onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                  readOnly={!isEditing}
                  className={cn(
                    "input-premium h-12 pl-12 font-bold transition-all",
                    isEditing ? "border-blue-200 bg-white ring-2 ring-blue-500/10" : "bg-slate-50/50 cursor-default",
                    isLoading && "animate-pulse"
                  )}
                  placeholder="Họ tên người dùng"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="phoneNum" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Số điện thoại
              </Label>
              <div className="group relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-600" size={18} />
                <Input
                  id="phoneNum"
                  value={isEditing ? tempProfile.phoneNum || '' : profile.phoneNum || ''}
                  onChange={(e) => setTempProfile({ ...tempProfile, phoneNum: e.target.value })}
                  readOnly={!isEditing}
                  className={cn(
                    "input-premium h-12 pl-12 font-bold transition-all",
                    isEditing ? "border-blue-200 bg-white ring-2 ring-blue-500/10" : "bg-slate-50/50 cursor-default",
                    isLoading && "animate-pulse"
                  )}
                  placeholder="Số điện thoại"
                />
              </div>
            </div>

            <div className="space-y-3 sm:col-span-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Địa chỉ Email (Cố định)
              </Label>
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                  value={profile.email || ''}
                  disabled
                  className="h-12 rounded-xl border-slate-100 bg-slate-50/80 pl-12 font-bold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-8 border-t border-slate-100 bg-slate-50/30 px-8 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
              <ShieldCheck size={14} className="text-emerald-500" />
              Dữ liệu cá nhân của bạn được bảo mật tuyệt đối
            </div>
            {isEditing ? (
              <div className="flex gap-3">
                <Button 
                  onClick={handleCancel}
                  variant="ghost" 
                  disabled={isUpdating}
                  className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100"
                >
                  <X size={14} className="mr-2" />
                  Hủy
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="btn-premium-primary h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest"
                >
                  {isUpdating ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Save size={14} className="mr-2" />
                  )}
                  Lưu thay đổi
                </Button>
              </div>
            ) : (
              <Button disabled variant="outline" className="h-10 rounded-xl border-slate-200 bg-white px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Đã đồng bộ
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
