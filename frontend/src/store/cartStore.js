import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      selectedBranch: null,
      paymentMethod: "pickup",

      setSelectedBranch: (branch) => set({ selectedBranch: branch, items: [] }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      addItem: (item) => {
        const { items } = get();
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          set({ items: get().items.filter((i) => i.id !== itemId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () =>
        set({ items: [], selectedBranch: null, paymentMethod: "pickup" }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "yumyum-cart",
    },
  ),
);

export default useCartStore;
