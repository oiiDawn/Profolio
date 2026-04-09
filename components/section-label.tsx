export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(286_100%_73%)]">
      {children}
    </p>
  );
}
