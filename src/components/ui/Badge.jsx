
const variants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-secondary/10 text-secondary',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        ${variants[variant] || variants.default}
        ${sizes[size] || sizes.md}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full bg-current`}
        />
      )}
      {children}
    </span>
  );
}

// Difficulty badge specifically for quiz questions
export function DifficultyBadge({ difficulty }) {
  const config = {
    easy: { label: 'Mudah', color: 'success', icon: '🟢' },
    medium: { label: 'Sedang', color: 'warning', icon: '🟡' },
    hard: { label: 'Sulit', color: 'danger', icon: '🔴' },
  };

  const { label, color, icon } = config[difficulty] || config.easy;

  return (
    <Badge variant={color} size="sm">
      <span>{icon}</span> {label}
    </Badge>
  );
}
