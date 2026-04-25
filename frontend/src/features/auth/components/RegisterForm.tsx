'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
import { useRegister } from '../hooks/useRegister';
import { RegisterRequest } from '../../../types/auth.types';
import { useRouter } from 'next/navigation'

type RegisterFormValues = RegisterRequest & {
  confirmPassword: string;
};

type RegisterFormFields = {
  label: string;
  id: string;
  name: keyof RegisterFormValues;
  type?: string;
  placeholder?: string;
};

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const router = useRouter();
  const { values, handleChange } = useForm<RegisterFormValues>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNum: '',
  });

  const { register } = useRegister();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (
      !values.email ||
      !values.password ||
      !values.fullName ||
      !values.phoneNum
    ) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (values.password !== values.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      setLoading(true);
      await register(values)
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
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
                className="text-slate-900 placeholder:text-slate-400"
              />
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {error && (
            <p className="text-destructive w-full text-sm" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
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
