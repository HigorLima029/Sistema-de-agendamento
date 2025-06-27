
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  CalendarDays, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Interface para as props do Layout
interface LayoutProps {
  children: ReactNode;
  currentPage?: string;    // Página atual para destacar no menu
}

// Interface para itens do menu de navegação
interface NavItem {
  label: string;
  icon: any;
  path: string;
  adminOnly?: boolean;     // Item visível apenas para administradores
}

// Itens do menu principal
const navItems: NavItem[] = [
  { label: 'Dashboard', icon: BarChart3, path: '/' },
  { label: 'Agendamentos', icon: CalendarDays, path: '/schedules' },
  { label: 'Usuários', icon: Users, path: '/users', adminOnly: true },
  { label: 'Relatórios', icon: BarChart3, path: '/reports' },
  { label: 'Configurações', icon: Settings, path: '/settings', adminOnly: true }
];

export const Layout = ({ children, currentPage = '' }: LayoutProps) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Função para verificar se item do menu deve ser exibido
  const shouldShowNavItem = (item: NavItem) => {
    if (item.adminOnly && user?.type !== 'admin') {
      return false;
    }
    return true;
  };

  // Função para destacar item ativo no menu
  const isActivePage = (path: string) => {
    if (path === '/' && currentPage === '') return true;
    return currentPage === path.substring(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra lateral - versão desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-tracker-blue-800 to-tracker-blue-900 overflow-y-auto">
          {/* Logo e título */}
          <div className="flex items-center flex-shrink-0 px-4 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-tracker-green-500 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-white font-bold text-lg">TrackerPro</h1>
                <p className="text-tracker-blue-200 text-sm">Gestão de Instalações</p>
              </div>
            </div>
          </div>

          {/* Navegação principal */}
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navItems.filter(shouldShowNavItem).map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActivePage(item.path)
                    ? 'bg-tracker-blue-700 text-white shadow-lg'
                    : 'text-tracker-blue-100 hover:bg-tracker-blue-700 hover:text-white'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Informações do usuário e logout */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-tracker-blue-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-tracker-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-tracker-blue-200 capitalize">{user?.type}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-tracker-blue-200 hover:text-white hover:bg-tracker-blue-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Barra lateral móvel */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-tracker-blue-800 to-tracker-blue-900">
            {/* Conteúdo igual à versão desktop */}
            <div className="flex items-center flex-shrink-0 px-4 py-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-tracker-green-500 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-white font-bold text-lg">TrackerPro</h1>
                  <p className="text-tracker-blue-200 text-sm">Gestão de Instalações</p>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 px-4 pb-4 space-y-2">
              {navItems.filter(shouldShowNavItem).map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={`
                    group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActivePage(item.path)
                      ? 'bg-tracker-blue-700 text-white shadow-lg'
                      : 'text-tracker-blue-100 hover:bg-tracker-blue-700 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="lg:pl-64">
        {/* Barra superior */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Botão do menu móvel */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Barra de pesquisa */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar agendamentos, clientes..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Ações da barra superior */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {/* Indicador de notificações */}
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
              </Button>
              
              {/* Info do usuário (desktop) */}
              <div className="hidden lg:flex lg:items-center lg:space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.type}</p>
                </div>
                <div className="w-8 h-8 bg-tracker-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Área de conteúdo */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
