import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  setUser: (user, accessToken) => set({ user, accessToken, loading: false }),
  clearUser: () => set({ user: null, accessToken: null, loading: false }),
  setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;
