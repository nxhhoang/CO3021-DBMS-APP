'use client';

import Logo from '@/components/common/Logo';
import { ProductSearch } from '@/features/products';
import { DropdownProfile } from './DropdownProfile';
import { CartButton } from './CartButton';

const Header = () => {

  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <ProductSearch/>
        <div className="flex items-center gap-2">
          <CartButton count={2} />
          <DropdownProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
