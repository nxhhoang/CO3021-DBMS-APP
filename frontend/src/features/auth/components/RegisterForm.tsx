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
import { Field, FieldError } from '@/components/ui/field';

export function RegisterForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const router = useRouter();
  const { values, handleChange } = useForm<
    RegisterRequest & { confirmPassword: string }
  >({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNum: '',
  });

  const { register } = useRegister();

  const handleRegister = async () => {
    setError('');

    if (values.password !== values.confirmPassword) {
      setError('Password and confirm password do not match');
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>Create new account</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={values.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password-confirm">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
          />
        </div>

        {/* Fullname */}
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={values.fullName}
            onChange={handleChange}
          />
        </div>

        {/* Phone number */}
        <div className="grid gap-2">
          <Label htmlFor="phoneNum">Phone number</Label>
          <Input
            id="phoneNum"
            value={values.phoneNum}
            onChange={handleChange}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <FieldError>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </FieldError>
        <Button onClick={handleRegister} className="w-full" disabled={loading}>
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
  );
}
