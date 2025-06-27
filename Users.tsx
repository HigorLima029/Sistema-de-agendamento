import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  Users as UsersIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import { User, UserType } from '@/types/system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserFormDialog } from '@/components/UserFormDialog';

export const Users = () => {
  // Estados para filtros e pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Função para adicionar novo usuário
  const handleUserAdd = (newUser: User) => {
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  // Função para filtrar usuários
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Função para obter cor do badge baseado no tipo de usuário
  const getUserTypeBadgeVariant = (type: UserType) => {
    switch (type) {
      case UserType.ADMIN:
        return 'destructive'; // Vermelho para admin
      case UserType.REPRESENTATIVE:
        return 'default'; // Verde para representante
      case UserType.TECHNICIAN:
        return 'secondary'; // Azul para técnico
      default:
        return 'outline';
    }
  };

  // Função para traduzir tipo de usuário para português
  const getUserTypeLabel = (type: UserType) => {
    const labels = {
      [UserType.ADMIN]: 'Administrador',
      [UserType.REPRESENTATIVE]: 'Representante',
      [UserType.TECHNICIAN]: 'Técnico'
    };
    return labels[type];
  };

  // Função para obter iniciais do nome
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Função para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Estatísticas dos usuários
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.type === UserType.ADMIN).length,
    representatives: users.filter(u => u.type === UserType.REPRESENTATIVE).length,
    technicians: users.filter(u => u.type === UserType.TECHNICIAN).length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length
  };

  return (
    <Layout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
            <p className="text-gray-600 mt-1">
              Gerencie usuários e permissões do sistema
            </p>
          </div>
          <UserFormDialog onUserAdd={handleUserAdd} />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{userStats.admins}</div>
              <p className="text-xs text-gray-500">Admins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-tracker-green-600">{userStats.representatives}</div>
              <p className="text-xs text-gray-500">Representantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-tracker-blue-600">{userStats.technicians}</div>
              <p className="text-xs text-gray-500">Técnicos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
              <p className="text-xs text-gray-500">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{userStats.inactive}</div>
              <p className="text-xs text-gray-500">Inativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barra de pesquisa */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por tipo */}
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as UserType | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value={UserType.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserType.REPRESENTATIVE}>Representante</SelectItem>
                  <SelectItem value={UserType.TECHNICIAN}>Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <div className="grid gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    {/* Informações principais do usuário */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-tracker-blue-100 text-tracker-blue-700 font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <Badge variant={getUserTypeBadgeVariant(user.type)}>
                            <Shield className="mr-1 h-3 w-3" />
                            {getUserTypeLabel(user.type)}
                          </Badge>
                          {user.isActive ? (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <UserCheck className="mr-1 h-3 w-3" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              <UserX className="mr-1 h-3 w-3" />
                              Inativo
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center">
                              <Phone className="mr-1 h-4 w-4" />
                              {user.phone}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            Criado em {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-tracker-blue-600 hover:text-tracker-blue-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Estado vazio
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UsersIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  {searchTerm || typeFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar usuários.'
                    : 'Ainda não há usuários cadastrados. Crie o primeiro usuário para começar.'
                  }
                </p>
                <UserFormDialog onUserAdd={handleUserAdd} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo dos resultados */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <p>
              Mostrando {filteredUsers.length} de {users.length} usuários
            </p>
            <p>
              {searchTerm && `Filtrado por: "${searchTerm}"`}
              {typeFilter !== 'all' && ` • Tipo: ${getUserTypeLabel(typeFilter as UserType)}`}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
