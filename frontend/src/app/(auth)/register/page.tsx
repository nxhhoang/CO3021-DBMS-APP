'use client'
import { RegisterForm } from '@/features/auth'

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
  )
}

export default RegisterPage
