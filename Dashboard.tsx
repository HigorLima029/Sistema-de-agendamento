
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CalendarDays, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  Wrench
} from 'lucide-react';
import { mockSchedules, generateReportData } from '@/data/mockData';
import { ScheduleStatus } from '@/types/system';
import { Badge } from '@/components/ui/badge';

export const Dashboard = () => {
  // Gera dados para o dashboard baseado nos agendamentos
  const reportData = generateReportData();
  
  // Agendamentos recentes (últimos 5)
  const recentSchedules = mockSchedules
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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

  // Calcula taxa de conclusão
  const completionRate = reportData.totalSchedules > 0 
    ? (reportData.completedSchedules / reportData.totalSchedules) * 100 
    : 0;

  return (
    <Layout currentPage="">
      <div className="space-y-6">
        {/* Header do Dashboard */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Visão geral do sistema de agendamentos de instalação
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Atualizado: {new Date().toLocaleString('pt-BR')}</span>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total de Agendamentos */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Agendamentos
              </CardTitle>
              <CalendarDays className="h-5 w-5 text-tracker-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {reportData.totalSchedules}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          {/* Agendamentos Concluídos */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Concluídos
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-tracker-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {reportData.completedSchedules}
              </div>
              <div className="flex items-center mt-1">
                <Progress value={completionRate} className="flex-1 h-2" />
                <span className="ml-2 text-xs text-gray-500">
                  {completionRate.toFixed(0)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Agendamentos Pendentes */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pendentes
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {reportData.pendingSchedules}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Requer atenção
              </p>
            </CardContent>
          </Card>

          {/* Tempo Médio */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tempo Médio
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-tracker-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {reportData.averageCompletionTime}h
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Por instalação
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agendamentos Recentes */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5 text-tracker-blue-600" />
                Agendamentos Recentes
              </CardTitle>
              <CardDescription>
                Últimos agendamentos criados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-tracker-blue-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-tracker-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {schedule.customer.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {schedule.date.toLocaleDateString('pt-BR')} às {schedule.time}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Técnico: {schedule.technician.name}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant={getStatusBadgeVariant(schedule.status)}>
                        {getStatusLabel(schedule.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentSchedules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarDays className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Nenhum agendamento encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance por Técnico */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-tracker-green-600" />
                Performance por Técnico
              </CardTitle>
              <CardDescription>
                Agendamentos por técnico neste mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.schedulesByTechnician.map((tech) => (
                  <div key={tech.technicianId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-tracker-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-tracker-green-700">
                            {tech.technicianName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {tech.technicianName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tech.completed}/{tech.total} concluídos
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{tech.total}</p>
                        <p className="text-xs text-gray-500">agendamentos</p>
                      </div>
                    </div>
                    <Progress 
                      value={tech.total > 0 ? (tech.completed / tech.total) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                ))}
                {reportData.schedulesByTechnician.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Nenhum técnico encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por Status */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>
              Visualização dos agendamentos organizados por status atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {reportData.schedulesByStatus.map(({ status, count }) => (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getStatusLabel(status)}
                  </div>
                  <div className="mt-2">
                    <Badge variant={getStatusBadgeVariant(status)} className="text-xs">
                      {reportData.totalSchedules > 0 
                        ? `${((count / reportData.totalSchedules) * 100).toFixed(0)}%`
                        : '0%'
                      }
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
