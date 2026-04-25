import { cn } from '@/lib/utils'

interface PageBackgroundProps {
  children: React.ReactNode
  /**
   * vibrant  — large blobs with blur + radial overlay (landing, products, product detail)
   * subtle   — light blobs, no blur (cart, checkout)
   * minimal  — base layer only (empty states)
   */
  variant?: 'vibrant' | 'subtle' | 'minimal'
  className?: string
}

export default function PageBackground({
  children,
  variant = 'vibrant',
  className,
}: PageBackgroundProps) {
  return (
    <div
      className={cn(
        'relative isolate min-h-screen w-full overflow-clip bg-white text-slate-900',
        className,
      )}
    >
      <div className="mesh-gradient-container">
        <div className="mesh-gradient-base" />
        <div className="mesh-gradient-dots" />
        <div className="mesh-gradient-spotlight" />

        {variant === 'vibrant' && (
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="mesh-gradient-blob -top-[5%] left-[15%] h-[600px] w-[600px] animate-pulse bg-blue-300/20 blur-[120px]" />
              <div className="mesh-gradient-blob top-[10%] right-[10%] h-[500px] w-[500px] bg-cyan-300/20 blur-[100px]" />
              <div className="mesh-gradient-blob top-[40%] left-[5%] h-[400px] w-[400px] bg-sky-200/20 blur-[90px]" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] opacity-20" />
          </>
        )}

        {variant === 'subtle' && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="mesh-gradient-blob -top-[10%] left-[5%] h-[800px] w-[800px] bg-blue-400/5 dark:bg-blue-900/10" />
            <div className="mesh-gradient-blob top-[40%] -right-[10%] h-[600px] w-[600px] bg-cyan-400/5 dark:bg-cyan-900/10" />
          </div>
        )}
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
