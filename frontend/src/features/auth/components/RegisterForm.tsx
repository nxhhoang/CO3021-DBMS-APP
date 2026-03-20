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
import { useRouter } from 'next/navigation';
import { FieldError } from '@/components/ui/field';

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

    if (values.password !== values.confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    if (
      !values.email ||
      !values.password ||
      !values.fullName ||
      !values.phoneNum
    ) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await register(values);
      alert('Register success');
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fieldList: RegisterFormFields[] = [
    {
      label: 'Email',
      id: 'email',
      name: 'email',
      type: 'email',
      placeholder: 'name@example.com',
    },
    {
      label: 'Password',
      id: 'password',
      name: 'password',
      type: 'password',
      placeholder: 'Enter your password',
    },
    {
      label: 'Confirm password',
      id: 'confirmPassword',
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm your password',
    },
    {
      label: 'Full name',
      id: 'fullName',
      name: 'fullName',
      type: 'text',
      placeholder: 'Enter your full name',
    },
    {
      label: 'Phone number',
      id: 'phoneNum',
      name: 'phoneNum',
      type: 'text',
      placeholder: 'Enter your phone number',
    },
  ];

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-1 items-center justify-center"
    >
      <Card className="w-full max-w-md flex-col gap-2">
        <CardHeader className="mb-2 space-y-1">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create new account</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {fieldList.map((field: RegisterFormFields) => (
            <div className="grid gap-2" key={field.id}>
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={values[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <FieldError>
            <div className="min-h-6">
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </FieldError>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create new account'}
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
