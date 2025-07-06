type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = '',
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-8 sm:px-10 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
