import { Toaster as SonnerToaster } from "sonner";

export function Toaster({
  richColors,
  position,
}: {
  richColors?: boolean;
  position?: string;
}) {
  return (
    <SonnerToaster
      richColors={richColors}
      position={
        (position as Parameters<typeof SonnerToaster>[0]["position"]) ??
        "top-right"
      }
      toastOptions={{
        style: {
          background: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
        },
      }}
    />
  );
}
