'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ProductImage({
  src = null,
  alt = '',
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [fallBack, setFallBack] = useState<boolean>(false);

  if (fallBack || !src) {
    return (
      <div
        className={cn(
          'bg-muted text-muted-foreground flex items-center justify-center text-sm',
          className,
        )}
      ></div>
    );
  }

  return (
    <div className={cn('relative h-full w-full', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="rounded-md object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setFallBack(true)}
      />
    </div>
  );
}
