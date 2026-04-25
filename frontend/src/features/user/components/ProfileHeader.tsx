'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useProfile } from '../hooks/useProfile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export function ProfileHeader() {
  const { profile } = useProfile();

  const initials = useMemo(() => {
    if (!profile?.fullName || !profile.fullName.trim()) {
      return '?';
    }

    return profile.fullName
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [profile]);

  if (!profile) return <Skeleton className="h-24 w-full" />;

  const { fullName, email } = profile;

  return (
    <Card className="from-primary to-secondary text-primary-foreground bg-linear-to-r">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{fullName}</h2>
            <p className="text-sm opacity-80">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
