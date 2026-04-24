'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { authService } from '@/features/auth/services/auth.service';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, Phone, Loader2, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { values, handleChange } = useForm({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNum: '',
  });

  const handleRegister = async () => {
    if (!values.email || !values.password || !values.fullName || !values.phoneNum) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phoneNum: values.phoneNum,
      };

      await authService.register(payload);
      toast.success('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-premium border-none bg-white/70 shadow-2xl backdrop-blur-xl">
      <CardHeader className="space-y-3 pb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200/50">
          <UserPlus size={24} />
        </div>
        <div className="space-y-1">
          <CardTitle className="font-display text-3xl font-black tracking-tight text-slate-900">
            Tạo tài khoản
          </CardTitle>
          <CardDescription className="font-medium text-slate-500">
            Tham gia cộng đồng mua sắm BKShop ngay hôm nay
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fullname */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-slate-400">
            Họ và tên
          </Label>
          <div className="relative">
            <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={values.fullName}
              onChange={handleChange}
              disabled={loading}
              className="input-premium h-11 pl-11"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400">
            Địa chỉ Email
          </Label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="vidu@email.com"
              value={values.email}
              onChange={handleChange}
              disabled={loading}
              className="input-premium h-11 pl-11"
            />
          </div>
        </div>

        {/* Phone number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNum" className="text-xs font-black uppercase tracking-widest text-slate-400">
            Số điện thoại
          </Label>
          <div className="relative">
            <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="phoneNum"
              placeholder="0912 xxx xxx"
              value={values.phoneNum}
              onChange={handleChange}
              disabled={loading}
              className="input-premium h-11 pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">
              Mật khẩu
            </Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                disabled={loading}
                className="input-premium h-11 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-slate-400">
              Xác nhận
            </Label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="input-premium h-11 pl-11"
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-6 pt-6">
        <Button 
          onClick={handleRegister} 
          disabled={loading}
          className="btn-premium-primary h-12 w-full text-sm shadow-xl shadow-blue-200/20 transition-all hover:translate-y-[-2px] active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo tài khoản...
            </>
          ) : (
            <>
              Đăng ký tài khoản
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-center text-sm font-medium text-slate-500">
          Bạn đã có tài khoản?{' '}
          <Link
            href="/login"
            className="font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
