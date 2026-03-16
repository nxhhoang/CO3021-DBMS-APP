import { create } from 'zustand';
import { CartItem } from '@/types';

type CartState = {
  items: CartItem[];
  selectedSkus: string[];
  loading: boolean;

  setItems: (items: CartItem[]) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeItem: (sku: string) => void;
  toggleItemSelection: (sku: string) => void;
  toggleAllSelection: (selected: boolean) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  selectedSkus: [],
  loading: false,

  setItems: (items) => set({ items }),

  updateQuantity: (sku, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.sku === sku ? { ...item, quantity } : item,
      ),
    })),

  removeItem: (sku) =>
    set((state) => ({
      items: state.items.filter((item) => item.sku !== sku),
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
}));
