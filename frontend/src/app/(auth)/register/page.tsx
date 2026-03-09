'use client';

import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import Link from 'next/link';
import { useForm } from '@/hooks/useForm';
// import { Phone } from 'lucide-react';

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Gom tất cả useState cũ vào 1 Hook duy nhất
  const { values, handleChange } = useForm({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNum: '',
  });

  const handleRegister = async () => {
    // Truy cập giá trị qua object 'values'
    if (values.password !== values.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await authService.register(values); // Truyền thẳng object values vào service
      alert('Register success');
      router.push('/login');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Register failed');
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
};

export default RegisterPage;
