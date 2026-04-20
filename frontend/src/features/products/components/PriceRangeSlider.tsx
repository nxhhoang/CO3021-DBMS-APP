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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={priceRange[0]}
          className="bg-muted/50 w-full rounded-md border px-2 py-1 text-sm"
          min={min}
          max={priceRange[1]}
          onChange={(e) => handleMinInput(e.target.value)}
        />

        <span>-</span>

        <input
          type="number"
          value={priceRange[1]}
          className="bg-muted/50 w-full rounded-md border px-2 py-1 text-sm"
          min={priceRange[0]}
          max={max}
          onChange={(e) => handleMaxInput(e.target.value)}
        />
      </div>

      <Slider
        min={min}
        max={max}
        step={50}
        value={priceRange}
        onValueChange={(val) => setPriceRange(val as [number, number])}
      />
    </div>
  )
};

export default PriceRangeSlider;
