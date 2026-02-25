import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="flex items-center flex-wrap border bg-white p-3">
            <Link href="/" className="p-2 mr-4 text-xl font-bold">
                Home
            </Link>
            <div className="flex items-center w-auto">
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