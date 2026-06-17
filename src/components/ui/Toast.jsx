import { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import useUIStore from '../../stores/useUIStore';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: 'bg-success text-white',
  error: 'bg-danger text-white',
  warning: 'bg-warning text-gray-900',
  info: 'bg-primary text-white',
};

export default function Toast() {
  const { toast, showToast: setToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration || 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  const Icon = icons[toast.type] || icons.info;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
      <div
        className={`
          flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg
          ${colors[toast.type] || colors.info}
          min-w-[280px] max-w-md
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{toast.message}</p>
        <button
          onClick={() => setToast(null)}
          className="p-0.5 rounded hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
