import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex flex-wrap items-center border bg-white p-3">
      <Link href="/" className="mr-4 p-2 text-xl font-bold">
        Home
      </Link>
      <div className="flex w-auto items-center">
        <Link href="/login" className="p-2">
          Login
        </Link>
        <Link href="/cart" className="p-2">
          Cart
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
