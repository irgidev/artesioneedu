
export default function PageContainer({
  children,
  className = '',
  noPadding = false,
  noBottomPadding = false,
}) {
  return (
    <main
      className={`
        min-h-screen w-full max-w-lg mx-auto
        ${noPadding ? '' : 'px-4 pt-20'}
        ${noBottomPadding ? '' : 'pb-24'}
        ${className}
      `}
    >
      {children}
    </main>
  );
}
