import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3 } from 'lucide-react';

const navItems = [
  {
    path: '/',
    label: 'Beranda',
    icon: Home,
  },
  {
    path: '/stats',
    label: 'Statistik',
    icon: BarChart3,
  },
];

export default function BottomNav() {
  const location = useLocation();

  // Hide bottom nav on quiz page
  if (location.pathname.startsWith('/quiz')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-gray-200/50 dark:border-gray-700/50 safe-area-bottom">
      <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl
                transition-all duration-200
                ${isActive
                  ? 'text-primary'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }
              `}
            >
              <div
                className={`
                  relative p-1.5 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-primary/10 -translate-y-1 shadow-sm'
                    : ''
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-primary' : ''
                  }`}
                />
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-primary font-semibold' : ''
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-white dark:bg-gray-900" />
    </nav>
  );
}
