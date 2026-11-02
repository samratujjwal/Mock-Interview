import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  loading: false,
  setUser: (user, accessToken) => set({ user, accessToken }),
  clearUser: () => set({ user: null, accessToken: null }),
  setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;
