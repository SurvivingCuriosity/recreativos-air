export const FullPageSpinner = () => {
  return (
    <div
      role="status"
      className="flex h-svh w-full grow items-center justify-center bg-background"
    >
      <p className="animate-pulse text-muted-foreground">Cargando...</p>
    </div>
  );
};
