import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      setAuth: (admin, token) => {
        localStorage.setItem("yumyum_admin_token", token);
        set({ admin, token, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem("yumyum_admin_token");
        set({ admin: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "yumyum-admin-auth",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
