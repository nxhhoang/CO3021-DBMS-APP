'use client';

import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
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
import { authService } from '@/services/auth.service';
// import { Phone } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const result = await authService.register({
        email,
        password,
        fullName,
        phoneNum,
      });
      alert(result.message || 'Register success');
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password-confirm">Confirm Password</Label>
          <Input
            id="password-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Fullname */}
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Phone number */}
        <div className="grid gap-2">
          <Label htmlFor="phoneNum">Phone number</Label>
          <Input
            id="phoneNum"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button onClick={handleRegister} className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create new account'}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account? Sign in
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
