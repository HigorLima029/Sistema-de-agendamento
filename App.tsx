
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Login } from "@/components/Login";
import Dashboard from "./pages/Dashboard";
import Schedules from "./pages/Schedules";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Cria instância do cliente React Query para gerenciamento de estado
const queryClient = new QueryClient();

// Componente que verifica autenticação e renderiza as rotas apropriadas
const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  // Exibe tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tracker-blue-900 to-tracker-blue-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário logado, exibe tela de login
  if (!user) {
    return <Login />;
  }

  // Se usuário está logado, exibe as rotas do sistema
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/schedules" element={<Schedules />} />
      {/* Rota de usuários apenas para administradores */}
      {user.type === 'admin' && (
        <Route path="/users" element={<Users />} />
      )}
      <Route path="/reports" element={<Reports />} />
      {/* Rota de captura para páginas não encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Componente principal da aplicação
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Provider de autenticação envolve toda a aplicação */}
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
