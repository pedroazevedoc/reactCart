interface ContainerProps {
  children: React.ReactNode;
  title: string;
}

export function Container({ children, title }: ContainerProps) {
  return (
    <main className="w-full max-w-7xl px-4 mx-auto h-screen">
      <h1 className="font-bold text-2xl mt-6 mb-4 text-center">{title}</h1>
      {children}
    </main>
  );
}