import { AuthProvider } from "@/contexts/auth-context";
import Navigation from "@/navigations/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Navigation />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
