import { useEffect } from 'react';
import { X } from 'lucide-react';
import useUIStore from '../../stores/useUIStore';

export default function Modal() {
  const { activeModal, closeModal, modalData } = useUIStore();

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (activeModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModal]);

  if (!activeModal) return null;

  // Built-in modal types
  const renderModalContent = () => {
    switch (activeModal) {
      case 'confirm':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {modalData?.title || 'Konfirmasi'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {modalData?.message || 'Apakah kamu yakin?'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  modalData?.onConfirm?.();
                  closeModal();
                }}
                className="px-6 py-2.5 rounded-xl bg-danger text-white font-medium hover:brightness-110 transition-all"
              >
                {modalData?.confirmText || 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {modalData?.title || 'Berhasil!'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{modalData?.message}</p>
            <button
              onClick={() => {
                modalData?.onClose?.();
                closeModal();
              }}
              className="btn-primary px-8"
            >
              OK
            </button>
          </div>
        );

      default:
        return modalData?.content || null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={closeModal}
      />
      
      {/* Modal content */}
      <div
        className={`
          relative w-full sm:max-w-md 
          bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl
          p-6 shadow-2xl
          animate-fade-in-up
          max-h-[85vh] overflow-y-auto
        `}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {renderModalContent()}
      </div>
    </div>
  );
}
