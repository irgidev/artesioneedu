import { Sun, Moon } from 'lucide-react';
import useStatsStore from '../../stores/useStatsStore';

export default function ThemeToggle({ className = '' }) {
  const darkMode = useStatsStore((s) => s.preferences.darkMode);
  const updatePreferences = useStatsStore((s) => s.updatePreferences);

  const toggle = () => {
    const next = !darkMode;
    updatePreferences({ darkMode: next });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      onClick={toggle}
      className={`
        p-2 rounded-xl transition-colors
        ${darkMode
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${className}
      `}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
