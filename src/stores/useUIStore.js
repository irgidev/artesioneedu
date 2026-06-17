import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUIStore = create(
  persist(
    (set) => ({
      // Navigation
      currentPage: 'home',
      previousPage: null,
      
      // Modal state
      activeModal: null,
      modalData: null,

      // Toast notification
      toast: null,

      // Set current page
      setCurrentPage: (page) => {
        set((state) => ({
          previousPage: state.currentPage,
          currentPage: page,
        }));
      },

      // Open modal
      openModal: (modalType, data = null) => {
        set({ activeModal: modalType, modalData: data });
      },

      // Close modal
      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },

      // Show toast
      showToast: (message, type = 'info', duration = 3000) => {
        set({ toast: { id: Date.now(), message, type, duration } });
        
        // Auto dismiss
        setTimeout(() => {
          set((state) =>
            state.toast?.id === (Date.now() - duration + 100)
              ? { toast: null }
              : state
          );
        }, duration);
      },
    }),
    {
      name: 'artesioneedu-ui',
      version: 1,
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);

export default useUIStore;
