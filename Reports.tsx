import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { generateReportData, mockSchedules } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const Reports = () => {
  // Gera dados do relatório
  const reportData = generateReportData();
  const [isExporting, setIsExporting] = useState(false);

  // Função para exportar CSV real
  const exportToCSV = () => {
    // Cabeçalhos do CSV
    const headers = [
      'ID',
      'Data',
      'Horário',
      'Cliente',
      'Telefone Cliente',
      'Endereço',
      'Técnico',
      'Telefone Técnico',
      'Representante',
      'Equipamento',
      'Número de Série',
      'Status',
      'Observações',
      'Data Conclusão'
    ];

    // Converte os dados para formato CSV
    const csvData = mockSchedules.map(schedule => [
      schedule.id,
      schedule.date.toLocaleDateString('pt-BR'),
      schedule.time,
      schedule.customer.name,
      schedule.customer.phone,
      schedule.customer.address,
      schedule.technician.name,
      schedule.technician.phone,
      schedule.representative.name,
      schedule.equipment.model,
      schedule.equipment.serialNumber,
      schedule.status,
      schedule.observations || '',
      schedule.completedAt ? schedule.completedAt.toLocaleDateString('pt-BR') : ''
    ]);

    // Combina cabeçalhos com dados
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Cria o arquivo e faz o download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-agendamentos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para exportar Excel (simulada)
  const exportToExcel = () => {
    // Por enquanto mantém a simulação para Excel
    console.log('Exportação Excel ainda não implementada');
    alert('Funcionalidade Excel será implementada em breve!');
  };

  // Função principal de exportação
  const handleExport = async (format: 'excel' | 'csv') => {
    setIsExporting(true);
    
    try {
      if (format === 'csv') {
        exportToCSV();
      } else {
        exportToExcel();
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar arquivo. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Calcula percentuais
  const completionRate = reportData.totalSchedules > 0 
    ? (reportData.completedSchedules / reportData.totalSchedules) * 100 
    : 0;
  
  const pendingRate = reportData.totalSchedules > 0 
    ? (reportData.pendingSchedules / reportData.totalSchedules) * 100 
    : 0;

  return (
    <Layout currentPage="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">
              Análise detalhada e exportação de dados do sistema
            </p>
          </div>
          
          {/* Botões de exportação */}
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="border-tracker-green-200 text-tracker-green-700 hover:bg-tracker-green-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button 
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="bg-tracker-blue-600 hover:bg-tracker-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar Excel'}
            </Button>
          </div>
        </div>

        {/* Resumo Executivo */}
        <Card className="border-l-4 border-l-tracker-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-tracker-blue-600" />
              Resumo Executivo
            </CardTitle>
            <CardDescription>
              Visão geral dos agendamentos e performance do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-tracker-blue-600 mb-2">
                  {reportData.totalSchedules}
                </div>
                <p className="text-sm text-gray-600">Total de Agendamentos</p>
                <p className="text-xs text-gray-500 mt-1">Período completo</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-tracker-green-600 mb-2">
                  {completionRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                <Progress value={completionRate} className="mt-2 h-2" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {reportData.pendingSchedules}
                </div>
                <p className="text-sm text-gray-600">Agendamentos Pendentes</p>
                <p className="text-xs text-gray-500 mt-1">{pendingRate.toFixed(1)}% do total</p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-tracker-blue-600 mb-2">
                  {reportData.averageCompletionTime}h
                </div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-xs text-gray-500 mt-1">Por instalação</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance por Técnico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-tracker-green-600" />
                Performance por Técnico
              </CardTitle>
              <CardDescription>
                Análise de produtividade dos técnicos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportData.schedulesByTechnician.map((tech, index) => {
                  const efficiency = tech.total > 0 ? (tech.completed / tech.total) * 100 : 0;
                  
                  return (
                    <div key={tech.technicianId} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-tracker-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-tracker-green-700">
                              #{index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{tech.technicianName}</p>
                            <p className="text-sm text-gray-500">
                              {tech.completed}/{tech.total} concluídos
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={efficiency >= 80 ? 'default' : efficiency >= 60 ? 'secondary' : 'destructive'}>
                            {efficiency.toFixed(0)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={efficiency} className="h-2" />
                      
                      {/* Métricas detalhadas */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-semibold text-tracker-blue-600">{tech.total}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-semibold text-green-600">{tech.completed}</div>
                          <div className="text-xs text-gray-500">Concluídos</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                          <div className="font-semibold text-yellow-600">{tech.total - tech.completed}</div>
                          <div className="text-xs text-gray-500">Pendentes</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Agendamentos por Representante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-tracker-blue-600" />
                Agendamentos por Representante
              </CardTitle>
              <CardDescription>
                Volume de agendamentos criados por representante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.schedulesByRepresentative.map((rep, index) => (
                  <div key={rep.representativeId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-tracker-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-tracker-blue-700">
                          {rep.representativeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{rep.representativeName}</p>
                        <p className="text-sm text-gray-500">Representante de vendas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-tracker-blue-600">{rep.total}</div>
                      <p className="text-xs text-gray-500">agendamentos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribuição por Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-tracker-blue-600" />
              Distribuição por Status
            </CardTitle>
            <CardDescription>
              Análise detalhada dos status dos agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {reportData.schedulesByStatus.map(({ status, count }) => {
                const percentage = reportData.totalSchedules > 0 
                  ? (count / reportData.totalSchedules) * 100 
                  : 0;
                
                // Define ícone e cor baseado no status
                const statusConfig = {
                  pending: { 
                    icon: AlertTriangle, 
                    color: 'text-yellow-600', 
                    bg: 'bg-yellow-50',
                    label: 'Pendentes'
                  },
                  scheduled: { 
                    icon: Calendar, 
                    color: 'text-blue-600', 
                    bg: 'bg-blue-50',
                    label: 'Agendados'
                  },
                  in_progress: { 
                    icon: Clock, 
                    color: 'text-orange-600', 
                    bg: 'bg-orange-50',
                    label: 'Em Andamento'
                  },
                  completed: { 
                    icon: CheckCircle, 
                    color: 'text-green-600', 
                    bg: 'bg-green-50',
                    label: 'Concluídos'
                  },
                  cancelled: { 
                    icon: AlertTriangle, 
                    color: 'text-red-600', 
                    bg: 'bg-red-50',
                    label: 'Cancelados'
                  }
                };

                const config = statusConfig[status as keyof typeof statusConfig];
                const StatusIcon = config.icon;

                return (
                  <div key={status} className={`p-6 rounded-xl ${config.bg} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                      <StatusIcon className={`h-8 w-8 ${config.color}`} />
                      <Badge variant="outline" className="text-xs">
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className={`text-3xl font-bold ${config.color}`}>
                        {count}
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {config.label}
                      </p>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Instruções de Exportação */}
        <Card className="border-tracker-green-200 bg-tracker-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-tracker-green-800">
              <FileText className="mr-2 h-5 w-5" />
              Informações sobre Exportação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-tracker-green-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Formato Excel (.xlsx)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Relatório completo com múltiplas abas</li>
                  <li>• Gráficos e formatação avançada</li>
                  <li>• Dados detalhados por técnico e representante</li>
                  <li>• Ideal para análises e apresentações</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Formato CSV (.csv)</h4>
                <ul className="text-sm space-y-1">
                  <li>• Dados em formato tabular simples</li>
                  <li>• Compatível com qualquer planilha</li>
                  <li>• Importação fácil em outros sistemas</li>
                  <li>• Ideal para processamento de dados</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
