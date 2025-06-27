
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '@/types/system';

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;              // Usuário logado atual
  login: (email: string, password: string) => Promise<boolean>; // Função de login
  logout: () => void;             // Função de logout
  isLoading: boolean;             // Estado de carregamento
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dados simulados de usuários para demonstração
// Em produção, isso viria de uma API/banco de dados
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'admin@rastreador.com',
    password: 'admin123',
    type: UserType.ADMIN,
    phone: '(11) 99999-9999',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'representante@rastreador.com',
    password: 'rep123',
    type: UserType.REPRESENTATIVE,
    phone: '(11) 88888-8888',
    createdAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'tecnico@rastreador.com',
    password: 'tec123',
    type: UserType.TECHNICIAN,
    phone: '(11) 77777-7777',
    createdAt: new Date('2024-02-01'),
    isActive: true
  }
];

// Provider do contexto de autenticação
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há usuário logado no localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('tracker_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('tracker_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Função de login - simula autenticação
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simula delay de requisição
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Busca usuário nas credenciais mock
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser && foundUser.isActive) {
      // Remove senha dos dados do usuário antes de salvar
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('tracker_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tracker_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
