import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth';

const NAV_ITEMS = [
  { label: 'Profile', href: '/user/profile' },
  { label: 'Addresses', href: '/user/addresses' },
  { label: 'Orders', href: '/user/orders' },
];

{
  /* Mobile Menu */
}
export const MobileMenu = () => {
  const router = useRouter();
  const { logout } = useAuthContext();

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) router.push(`/search?q=${encodeURIComponent(query.toString())}`);
  };



  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">Danh mục</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-4">
          <form onSubmit={onSearchSubmit} className="relative">
            <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
            <Input name="q" placeholder="Tìm kiếm..." className="pl-9" />
          </form>
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-accent rounded-md p-2 text-lg font-medium"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            <button
              onClick={logout}
              className="flex items-center p-2 text-lg font-medium text-red-500 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Đăng xuất
            </button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
