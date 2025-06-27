import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Car,
  Wrench,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { mockSchedules } from '@/data/mockData';
import { Schedule, ScheduleStatus } from '@/types/system';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleFormDialog } from '@/components/ScheduleFormDialog';

export const Schedules = () => {
  // Estados para filtros e pesquisa
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | 'all'>('all');
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);

  // Função para atualizar a lista após criar um agendamento
  const handleScheduleCreated = () => {
    // Em uma aplicação real, aqui recarregaríamos os dados da API
    console.log('Agendamento criado, atualizando lista...');
  };

  // Função para filtrar agendamentos
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = searchTerm === '' || 
      schedule.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para obter cor do badge baseado no status
  const getStatusBadgeVariant = (status: ScheduleStatus) => {
    switch (status) {
      case ScheduleStatus.COMPLETED:
        return 'default'; // Verde
      case ScheduleStatus.IN_PROGRESS:
        return 'secondary'; // Azul
      case ScheduleStatus.SCHEDULED:
        return 'outline'; // Cinza
      case ScheduleStatus.PENDING:
        return 'destructive'; // Vermelho
      default:
        return 'outline';
    }
  };

  // Função para traduzir status para português
  const getStatusLabel = (status: ScheduleStatus) => {
    const labels = {
      [ScheduleStatus.PENDING]: 'Pendente',
      [ScheduleStatus.SCHEDULED]: 'Agendado',
      [ScheduleStatus.IN_PROGRESS]: 'Em Andamento',
      [ScheduleStatus.COMPLETED]: 'Concluído',
      [ScheduleStatus.CANCELLED]: 'Cancelado'
    };
    return labels[status];
  };

  // Função para formatar data
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Layout currentPage="schedules">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os agendamentos de instalação de rastreadores
            </p>
          </div>
          <ScheduleFormDialog onScheduleCreated={handleScheduleCreated} />
        </div>

        {/* Filtros e Pesquisa */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barra de pesquisa */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por cliente, técnico ou equipamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtro por status */}
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ScheduleStatus | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value={ScheduleStatus.PENDING}>Pendente</SelectItem>
                  <SelectItem value={ScheduleStatus.SCHEDULED}>Agendado</SelectItem>
                  <SelectItem value={ScheduleStatus.IN_PROGRESS}>Em Andamento</SelectItem>
                  <SelectItem value={ScheduleStatus.COMPLETED}>Concluído</SelectItem>
                  <SelectItem value={ScheduleStatus.CANCELLED}>Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <div className="grid gap-6">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-tracker-blue-600" />
                        Agendamento #{schedule.id}
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatDate(schedule.date)} às {schedule.time}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(schedule.status)}>
                        {getStatusLabel(schedule.status)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Informações do Cliente */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <User className="mr-2 h-4 w-4 text-tracker-blue-600" />
                        Cliente
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{schedule.customer.name}</p>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-3 w-3" />
                          {schedule.customer.phone}
                        </div>
                        <div className="flex items-start">
                          <MapPin className="mr-2 h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{schedule.customer.address}</span>
                        </div>
                        {schedule.customer.vehicle && (
                          <div className="flex items-center">
                            <Car className="mr-2 h-3 w-3" />
                            {schedule.customer.vehicle.brand} {schedule.customer.vehicle.model} - {schedule.customer.vehicle.plate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Informações do Técnico */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Wrench className="mr-2 h-4 w-4 text-tracker-green-600" />
                        Técnico
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{schedule.technician.name}</p>
                        <div className="flex items-center">
                          <Phone className="mr-2 h-3 w-3" />
                          {schedule.technician.phone}
                        </div>
                        <p className="text-xs text-gray-500">
                          Representante: {schedule.representative.name}
                        </p>
                      </div>
                    </div>

                    {/* Informações do Equipamento */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <div className="w-4 h-4 mr-2 bg-tracker-blue-600 rounded-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        Equipamento
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{schedule.equipment.model}</p>
                        <p>S/N: {schedule.equipment.serialNumber}</p>
                        <Badge variant="outline" className="text-xs">
                          {schedule.equipment.status === 'assigned' ? 'Atribuído' : 
                           schedule.equipment.status === 'installed' ? 'Instalado' : 'Disponível'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Observações */}
                  {schedule.observations && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Observações</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {schedule.observations}
                      </p>
                    </div>
                  )}

                  {/* Data de conclusão */}
                  {schedule.completedAt && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Concluído em: {schedule.completedAt.toLocaleDateString('pt-BR')} às {schedule.completedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            // Estado vazio
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum agendamento encontrado
                </h3>
                <p className="text-gray-500 text-center mb-6 max-w-md">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar agendamentos.'
                    : 'Ainda não há agendamentos cadastrados. Crie o primeiro agendamento para começar.'
                  }
                </p>
                <ScheduleFormDialog onScheduleCreated={handleScheduleCreated} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Resumo dos resultados */}
        {filteredSchedules.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <p>
              Mostrando {filteredSchedules.length} de {schedules.length} agendamentos
            </p>
            <p>
              {searchTerm && `Filtrado por: "${searchTerm}"`}
              {statusFilter !== 'all' && ` • Status: ${getStatusLabel(statusFilter as ScheduleStatus)}`}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Schedules;
