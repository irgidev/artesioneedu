import { Link, useLocation } from 'react-router-dom';
import { Brain, BarChart3 } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
              ArtesionEdu
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight -mt-0.5">
              Latihan Soal Ujian
            </p>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link
              to="/stats"
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
