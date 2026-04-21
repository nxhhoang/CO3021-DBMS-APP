import { Slider } from '@/components/ui/slider';

interface PriceRangeSliderProps {
  priceRange: [number, number];
  min: number;
  max: number;
  setPriceRange: (value: [number, number]) => void;
}

const PriceRangeSlider = ({
  priceRange,
  setPriceRange,
  min,
  max,
}: PriceRangeSliderProps) => {
  const clamp = (value: number) => Math.min(max, Math.max(min, value))

  const handleMinInput = (rawValue: string) => {
    const parsed = Number(rawValue)
    if (Number.isNaN(parsed)) return

    const nextMin = clamp(parsed)
    const nextMax = Math.max(nextMin, priceRange[1])
    setPriceRange([nextMin, nextMax])
  }

  const handleMaxInput = (rawValue: string) => {
    const parsed = Number(rawValue)
    if (Number.isNaN(parsed)) return

    const nextMax = clamp(parsed)
    const nextMin = Math.min(priceRange[0], nextMax)
    setPriceRange([nextMin, nextMax])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₫</span>
          <input
            type="number"
            value={priceRange[0]}
            className="w-full rounded-xl border border-slate-100 bg-slate-50/50 py-2 pl-7 pr-3 text-xs font-bold text-slate-700 transition-all focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            min={min}
            max={priceRange[1]}
            onChange={(e) => handleMinInput(e.target.value)}
          />
        </div>

        <span className="text-slate-300">—</span>

        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₫</span>
          <input
            type="number"
            value={priceRange[1]}
            className="w-full rounded-xl border border-slate-100 bg-slate-50/50 py-2 pl-7 pr-3 text-xs font-bold text-slate-700 transition-all focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
            min={priceRange[0]}
            max={max}
            onChange={(e) => handleMaxInput(e.target.value)}
          />
        </div>
      </div>

      <div className="px-2">
        <Slider
          min={min}
          max={max}
          step={50}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="py-4"
        />
      </div>
    </div>
  )
};

export default PriceRangeSlider;
