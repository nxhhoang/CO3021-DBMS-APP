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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={priceRange[0]}
          className="bg-muted/50 w-full rounded-md border px-2 py-1 text-sm"
          onChange={(e) =>
            setPriceRange([Number(e.target.value), priceRange[1]])
          }
        />

        <span>-</span>

        <input
          type="number"
          value={priceRange[1]}
          className="bg-muted/50 w-full rounded-md border px-2 py-1 text-sm"
          onChange={(e) =>
            setPriceRange([priceRange[0], Number(e.target.value)])
          }
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
  );
};

export default PriceRangeSlider;
