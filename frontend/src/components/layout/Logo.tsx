import Link from 'next/link';
import { Store } from 'lucide-react';

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
    >
      <Store className="text-primary h-6 w-6" />
      <span>BKShop</span>
    </Link>
  );
}
