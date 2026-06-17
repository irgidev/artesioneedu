
const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700',
  success: 'btn-success',
  danger: 'btn-danger',
  ghost: 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200',
};

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center gap-2
        font-semibold cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'relative' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="w-5 h-5" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className="w-5 h-5" />
      )}
    </button>
  );
}
