import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background mt-20 w-full border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight">SHOP.IO</h3>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              Hệ thống bán lẻ thiết bị điện tử và thời trang hàng đầu Việt Nam.
              Tận hưởng trải nghiệm mua sắm công nghệ hiện đại.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Hỗ trợ khách hàng
            </h3>
            <nav className="flex flex-col space-y-2.5">
              {[
                'Sổ địa chỉ giao hàng',
                'Lịch sử đơn hàng',
                'Chính sách bảo mật',
              ].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-muted-foreground hover:text-primary w-fit text-sm transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Liên hệ
            </h3>
            <div className="text-muted-foreground flex flex-col space-y-3 text-sm">
              <div className="group flex items-center gap-2">
                <Mail className="group-hover:text-primary h-4 w-4 transition-colors" />
                <span>support@</span>
              </div>
              <div className="group flex items-center gap-2">
                <Phone className="group-hover:text-primary h-4 w-4 transition-colors" />
                <span>1900 xxxx</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 text-xs md:flex-row">
          <p>© 2026 E-commerce Project. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:underline">
              Điều khoản
            </Link>
            <Link href="#" className="hover:underline">
              Quyền riêng tư
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
