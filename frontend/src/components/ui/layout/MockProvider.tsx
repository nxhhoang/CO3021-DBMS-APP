'use client';

import { useEffect } from 'react';
import { enableMocking } from '@/mocks';

export default function MockProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    enableMocking();
  }, []);

  return <>{children}</>;
}
