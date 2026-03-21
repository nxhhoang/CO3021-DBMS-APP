'use client';

import { useEffect, useState } from 'react';
import { enableMocking } from '@/mocks';

export default function MockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    enableMocking().then(() => setIsReady(true));
  }, []);

  // Trong khi chờ MSW khởi động, không render con để tránh gọi API hụt
  if (!isReady && process.env.NEXT_PUBLIC_API_MOCKING === 'true') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm">
          Initializing Mock Environment...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
