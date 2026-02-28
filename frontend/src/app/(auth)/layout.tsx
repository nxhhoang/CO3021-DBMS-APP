import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* LEFT SIDE - Branding */}
      <div className="bg-muted hidden flex-col items-center justify-center p-10 md:flex">
        <div className="max-w-sm space-y-6 text-center">
          <h1 className="text-3xl font-bold">E-commerce</h1>
          <p className="text-muted-foreground">E-commerce description</p>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex items-center justify-center p-6">{children}</div>
    </div>
  );
}
