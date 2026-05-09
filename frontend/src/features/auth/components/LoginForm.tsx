'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useLogin } from '@/features/auth'
import { useRouter, useSearchParams } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<boolean>(false)

  const { login } = useLogin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirect') || '/'

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')
    setFieldErrors({})
    setLoading(true)
    try {
      await login({ email, password })
      router.replace(redirectPath)
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors
        const formattedErrors: Record<string, string> = {}
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key].msg
        })
        setFieldErrors(formattedErrors)
      } else {
        setError(err.message || 'Đăng nhập thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} noValidate>
      <Card className="w-full border-white/60 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="font-display text-3xl font-black tracking-tight text-slate-900">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-slate-500">
            Nhập thông tin tài khoản để tiếp tục
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="text-slate-900 placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-xs font-medium">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu"
              className="text-slate-900 placeholder:text-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <p className="text-red-600 text-xs font-medium">
                {fieldErrors.password}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {error && (
            <p className="text-red-600 w-full text-sm font-medium" role="alert">
              {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Chưa có tài khoản?{' '}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}
