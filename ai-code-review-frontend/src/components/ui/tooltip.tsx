import type { ReactNode } from "react";

// Minimal tooltip provider passthrough - a real implementation would use Radix UI
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
