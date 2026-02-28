import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

const RegisterPage = () => {
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
          <Input id="email" type="email" placeholder="name@example.com" />
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password-confirm">Confirn Password</Label>
          <Input id="password-confirm" type="password" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Create new account</Button>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account? Sign in
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
