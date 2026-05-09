'use client'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Loader2, CheckCircle2 } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useForm } from '@/hooks/useForm'
import { useRegister } from '../hooks/useRegister'
import { RegisterRequest } from '../../../types/auth.types'
import { useRouter } from 'next/navigation'

type RegisterFormValues = RegisterRequest & {
  confirmPassword: string
}

type RegisterFormFields = {
  label: string
  id: string
  name: keyof RegisterFormValues
  type?: string
  placeholder?: string
}

const REGISTER_FIELDS: RegisterFormFields[] = [
  {
    label: 'Email',
    id: 'email',
    name: 'email',
    type: 'email',
    placeholder: 'name@example.com',
  },
  {
    label: 'Mật khẩu',
    id: 'password',
    name: 'password',
    type: 'password',
    placeholder: 'Nhập mật khẩu',
  },
  {
    label: 'Xác nhận mật khẩu',
    id: 'confirmPassword',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Nhập lại mật khẩu',
  },
  {
    label: 'Họ và tên',
    id: 'fullName',
    name: 'fullName',
    type: 'text',
    placeholder: 'Nhập họ và tên',
  },
  {
    label: 'Số điện thoại',
    id: 'phoneNum',
    name: 'phoneNum',
    type: 'text',
    placeholder: 'Nhập số điện thoại',
  },
]

export function RegisterForm() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const router = useRouter()
  const { values, handleChange } = useForm<RegisterFormValues>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNum: '',
  })

  const { register } = useRegister()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (values.password !== values.confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: 'Mật khẩu xác nhận không khớp',
      }))
      return
    }

    try {
      setLoading(true)
      await register(values)
      setIsSuccess(true)
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors
        const formattedErrors: Record<string, string> = {}
        Object.keys(backendErrors).forEach((key) => {
          formattedErrors[key] = backendErrors[key].msg
        })
        setFieldErrors(formattedErrors)
      } else {
        setError(err.message || 'Đăng ký thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full border-white/60 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="font-display text-3xl font-black tracking-tight text-slate-900">
            Đăng ký thành công!
          </CardTitle>
          <CardDescription className="text-slate-600 text-base">
            Tài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể đăng
            nhập để bắt đầu trải nghiệm.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">Đăng nhập ngay</Link>
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Cảm ơn bạn đã tham gia cùng chúng tôi.
          </p>
        </CardFooter>
      </Card>
    )
  }

  return (
    <form onSubmit={handleRegister} noValidate>
      <Card className="w-full border-white/60 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="font-display text-3xl font-black tracking-tight text-slate-900">
            Đăng ký
          </CardTitle>
          <CardDescription className="text-slate-500">
            Tạo tài khoản mới để bắt đầu mua sắm
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {REGISTER_FIELDS.map((field: RegisterFormFields) => (
            <div className="grid gap-2" key={field.id}>
              <Label
                htmlFor={field.id}
                className="text-sm font-semibold text-slate-700"
              >
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={handleChange}
                disabled={loading}
                className="text-slate-900 placeholder:text-slate-400"
              />
              {fieldErrors[field.name] && (
                <p className="text-red-600 text-xs font-medium">
                  {fieldErrors[field.name]}
                </p>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {error && (
            <p className="text-red-600 w-full text-sm font-medium" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}
