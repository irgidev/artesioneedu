
export default function Card({
  children,
  interactive = false,
  padding = 'p-5',
  className = '',
  onClick,
  ...props
}) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-2xl
        ${interactive
          ? 'shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer transition-all duration-200'
          : 'shadow-sm border border-gray-100 dark:border-gray-700'
        }
        ${padding}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

// Gradient card variant for hero/featured sections
export function GradientCard({ children, gradient = 'from-primary to-secondary', className = '', ...props }) {
  return (
    <div
      className={`
        bg-gradient-to-br ${gradient}
        rounded-2xl p-6 text-white
        shadow-lg shadow-primary/20
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
