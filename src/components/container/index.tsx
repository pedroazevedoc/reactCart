interface ContainerProps {
  children: React.ReactNode;
  title: string;
}

export function Container({ children, title }: ContainerProps) {
  return (
    <main className="w-full max-w-7xl p-4 mx-auto">
      <h1 className="font-bold text-2xl mb-4 text-center">{title}</h1>
      {children}
    </main>
  );
}