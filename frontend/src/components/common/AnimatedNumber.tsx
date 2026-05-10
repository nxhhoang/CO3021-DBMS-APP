'use client'

import { useEffect, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatter?: (val: number) => string
  className?: string
}

export default function AnimatedNumber({
  value,
  duration = 1500,
  formatter = (val) => val.toLocaleString(),
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const start = performance.now()
    const target = Math.max(0, value)
    const initial = displayValue

    let frameId = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      
      const current = Math.round(initial + (target - initial) * easeOut)
      setDisplayValue(current)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [value, duration])

  return <span className={className}>{formatter(displayValue)}</span>
}
