import { create } from 'zustand';
import { CartItem } from '@/types';

type CartState = {
  items: CartItem[]
  selectedSkus: string[]
  loading: boolean

  setItems: (items: CartItem[]) => void
  setLoading: (loading: boolean) => void
  updateQuantity: (sku: string, quantity: number) => void
  removeItem: (sku: string) => void
  removeMultipleItems: (skus: string[]) => void
  toggleItemSelection: (sku: string) => void
  toggleAllSelection: (selected: boolean) => void
  clearSelection: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  selectedSkus: [],
  loading: false,

  setItems: (items) =>
    set((state) => {
      const availableSkus = new Set(items.map((item) => item.sku))
      return {
        items,
        selectedSkus: state.selectedSkus.filter((sku) =>
          availableSkus.has(sku),
        ),
      }
    }),

  setLoading: (loading) => set({ loading }),

  updateQuantity: (sku, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.sku === sku ? { ...item, quantity } : item,
      ),
    })),

  removeItem: (sku) =>
    set((state) => ({
      items: state.items.filter((item) => item.sku !== sku),
      selectedSkus: state.selectedSkus.filter(
        (selectedSku) => selectedSku !== sku,
      ),
    })),

  removeMultipleItems: (skus) =>
    set((state) => ({
      items: state.items.filter((item) => !skus.includes(item.sku)),
      selectedSkus: state.selectedSkus.filter((sku) => !skus.includes(sku)),
    })),

  toggleItemSelection: (sku) =>
    set((state) => ({
      selectedSkus: state.selectedSkus.includes(sku)
        ? state.selectedSkus.filter((s) => s !== sku)
        : [...state.selectedSkus, sku],
    })),
  toggleAllSelection: (selected) =>
    set((state) => ({
      selectedSkus: selected ? state.items.map((i) => i.sku) : [],
    })),

  clearSelection: () => set({ selectedSkus: [] }),
}))
