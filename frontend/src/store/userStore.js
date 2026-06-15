import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("yumyum_user_token", token);
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (user) =>
        set((state) => ({ user: { ...state.user, ...user } })),

      clearAuth: () => {
        localStorage.removeItem("yumyum_user_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "yumyum-user",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useUserStore;
