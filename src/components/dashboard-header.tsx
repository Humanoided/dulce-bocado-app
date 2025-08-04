import type { ReactNode } from "react";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-headline text-3xl md:text-4xl">{title}</h1>
        {description && <p className="text-lg text-muted-foreground">{description}</p>}
      </div>
      {children}
    </header>
  );
}
