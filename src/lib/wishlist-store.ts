import { create } from 'zustand';
import { useEffect } from 'react';
import { customerApi } from './customer-api';
import { useAuthStore } from './auth-store';

interface WishlistState {
  ids: string[];
  hydrated: boolean;
  refresh: () => Promise<void>;
  toggle: (product: { id: string }) => void;
  remove: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  hydrated: false,
  
  refresh: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      set({ ids: [], hydrated: true });
      return;
    }
    
    try {
      const ids = await customerApi.get<string[]>('/wishlist/ids');
      set({ ids, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  
  toggle: async (product) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    
    const { ids, refresh } = get();
    const already = ids.includes(product.id);
    
    // Optimistic update
    set({ ids: already ? ids.filter(x => x !== product.id) : [...ids, product.id] });
    
    try {
      if (already) {
        await customerApi.delete(`/wishlist/${product.id}`);
      } else {
        await customerApi.post('/wishlist', { productId: product.id });
      }
    } catch {
      // Revert optimism on failure
      refresh();
    }
  },
  
  remove: async (id) => {
    const { ids, refresh } = get();
    set({ ids: ids.filter(x => x !== id) });
    try {
      await customerApi.delete(`/wishlist/${id}`);
    } catch {
      refresh();
    }
  },
  
  isWishlisted: (id) => get().ids.includes(id),
}));

export function WishlistInit() {
  const refresh = useWishlistStore(state => state.refresh);
  const authLoading = useAuthStore(state => state.loading);

  useEffect(() => {
    if (!authLoading) {
      refresh();
    }
  }, [authLoading, refresh]);

  return null;
}
