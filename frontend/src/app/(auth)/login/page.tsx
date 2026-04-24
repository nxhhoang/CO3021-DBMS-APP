'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/features/auth/services/auth.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)

    try {
      const payload = {
        email: email.trim(),
        password,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
      }

      const result = await authService.login(payload)
      const { accessToken, refreshToken } = result.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('user', JSON.stringify(result.data.user))

      toast.success('Đăng nhập thành công! Đang chuyển hướng...')
      
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message)
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="card-premium border-none bg-white/70 shadow-2xl backdrop-blur-xl">
      <form onSubmit={handleLogin}>
        <CardHeader className="space-y-3 pb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <Lock size={24} />
          </div>
          <div className="space-y-1">
            <CardTitle className="font-display text-3xl font-black tracking-tight text-slate-900">
              Đăng nhập
            </CardTitle>
            <CardDescription className="font-medium text-slate-500">
              Chào mừng bạn trở lại với BKShop
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
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
                required
                value={email}
                placeholder="vidu@email.com"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="input-premium h-12 pl-11"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">
                Mật khẩu
              </Label>
              <Link 
                href="/forgot-password" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                required
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="input-premium h-12 pl-11"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6 pt-6">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="btn-premium-primary h-12 w-full text-sm shadow-xl shadow-slate-200/50 transition-all hover:translate-y-[-2px] active:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                Đăng nhập ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="relative w-full text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <span className="relative bg-white/0 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Hoặc tiếp tục với
            </span>
          </div>

          <p className="text-center text-sm font-medium text-slate-500">
            Bạn chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="font-bold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              Đăng ký miễn phí
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}