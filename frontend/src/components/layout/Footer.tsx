import Link from 'next/link'
import {
  Mail,
  Phone,
  Package,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-20 w-full overflow-hidden border-t border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 space-y-8 lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                <Package size={20} strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl font-black tracking-tight text-slate-900">
                BKShop
              </h3>
            </div>

            <p className="max-w-md font-sans text-base leading-relaxed font-medium text-slate-500">
              Trải nghiệm mua sắm công nghệ đỉnh cao với hệ thống bán lẻ hàng
              đầu. Chúng tôi cam kết mang đến những sản phẩm chính hãng và dịch
              vụ tận tâm nhất cho khách hàng.
            </p>

            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-all hover:border-slate-900 hover:text-slate-900 active:scale-90"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
              Khám phá
            </h4>
            <nav className="flex flex-col space-y-4">
              {[
                { label: 'Tất cả sản phẩm', href: '/products' },
                { label: 'Sổ địa chỉ', href: '/user/addresses' },
                { label: 'Lịch sử đơn hàng', href: '/user/orders' },
                { label: 'Chính sách bảo mật', href: '#' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-sans text-sm font-bold text-slate-500 transition-colors hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-display text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
              Liên hệ
            </h4>
            <div className="flex flex-col space-y-5">
              <div className="group flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Mail size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Email hỗ trợ
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    support@bkshop.vn
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                  <Phone size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Hotline
                  </p>
                  <p className="text-sm font-bold text-slate-700">1900 6789</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 md:flex-row">
          <p className="font-sans text-xs font-bold text-slate-400">
            © 2026 <span className="text-slate-900">BKShop</span>. Tất cả quyền
            được bảo lưu.
          </p>
          <div className="flex gap-8">
            <Link
              href="#"
              className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-900"
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              href="#"
              className="text-xs font-bold text-slate-400 transition-colors hover:text-slate-900"
            >
              Quyền riêng tư
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/5 blur-[80px]" />
    </footer>
  )
}
