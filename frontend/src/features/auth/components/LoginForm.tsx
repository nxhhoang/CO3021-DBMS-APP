'use client'
import { useState } from 'react'
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
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const { login } = useLogin()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
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
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {error && (
            <p className="text-destructive w-full text-sm" role="alert">
              {error}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={loading} size="lg">
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
