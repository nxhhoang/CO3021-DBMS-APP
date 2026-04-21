import Link from 'next/link';
import { Store } from 'lucide-react';

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 transition-all duration-300 active:scale-95"
    >
      <div className="relative flex h-9 w-9 items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-blue-600/10 transition-colors group-hover:bg-blue-600/20" />
        <Store className="relative z-10 text-blue-600" size={20} strokeWidth={2.5} />
      </div>
      <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
        BK<span className="text-blue-600">Shop</span>
      </span>
    </Link>
  );
}
