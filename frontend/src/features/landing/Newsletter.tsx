'use client'

import React from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-16 text-center shadow-2xl sm:px-16 sm:py-24">
        {/* DECORATION */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/20 blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">
            Bản tin của chúng tôi
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Đăng ký để nhận{' '}
            <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              ưu đãi đặc quyền
            </span>
          </h2>
          <p className="mt-6 text-lg text-slate-400">
            Trở thành người đầu tiên nhận thông báo về các bộ sưu tập mới và mã giảm giá hấp dẫn hàng tháng.
          </p>

          <form className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder-slate-500 backdrop-blur-md transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                required
              />
            </div>
            <Button
              type="submit"
              className="h-auto rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Đăng ký ngay <Send size={18} />
              </span>
            </Button>
          </form>
          <p className="mt-4 text-xs text-slate-500">
            Bằng cách đăng ký, bạn đồng ý với Chính sách bảo mật của chúng tôi.
          </p>
        </div>
      </div>
    </section>
  )
}
