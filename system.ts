
// Tipos e interfaces para o sistema de agendamento de rastreadores

// Enum para tipos de usuário - define os perfis de acesso no sistema
export enum UserType {
  ADMIN = 'admin',           // Administrador: acesso total ao sistema
  REPRESENTATIVE = 'representative',  // Representante: cria e gerencia agendamentos
  TECHNICIAN = 'technician'  // Técnico: visualiza agendamentos e atualiza status
}

// Enum para status dos agendamentos - controla o fluxo do serviço
export enum ScheduleStatus {
  PENDING = 'pending',       // Pendente: agendamento criado mas não confirmado
  SCHEDULED = 'scheduled',   // Agendado: confirmado e aguardando execução
  IN_PROGRESS = 'in_progress', // Em andamento: técnico iniciou a instalação
  COMPLETED = 'completed',   // Concluído: serviço finalizado com sucesso
  CANCELLED = 'cancelled'    // Cancelado: agendamento cancelado
}

// Interface para usuários do sistema
export interface User {
  id: string;               // ID único do usuário
  name: string;             // Nome completo
  email: string;            // E-mail para login
  type: UserType;           // Tipo/perfil do usuário
  phone?: string;           // Telefone opcional
  createdAt: Date;          // Data de criação da conta
  isActive: boolean;        // Status ativo/inativo
}

// Interface para clientes finais (onde será feita a instalação)
export interface Customer {
  id: string;               // ID único do cliente
  name: string;             // Nome do cliente
  phone: string;            // Telefone para contato
  address: string;          // Endereço completo
  vehicle?: {               // Dados do veículo (opcional)
    plate: string;          // Placa do veículo
    model: string;          // Modelo
    brand: string;          // Marca
    year?: number;          // Ano
  };
}

// Interface para equipamentos/rastreadores
export interface Equipment {
  id: string;               // ID único do equipamento
  serialNumber: string;     // Número de série do rastreador
  model: string;            // Modelo do equipamento
  status: 'available' | 'assigned' | 'installed'; // Status atual
  assignedTo?: string;      // ID do técnico responsável
}

// Interface principal para agendamentos
export interface Schedule {
  id: string;               // ID único do agendamento
  date: Date;               // Data do agendamento
  time: string;             // Horário (formato HH:MM)
  customerId: string;       // ID do cliente
  customer: Customer;       // Dados completos do cliente
  technicianId: string;     // ID do técnico responsável
  technician: User;         // Dados do técnico
  representativeId: string; // ID do representante que criou
  representative: User;     // Dados do representante
  equipmentId: string;      // ID do equipramento
  equipment: Equipment;     // Dados do equipamento
  status: ScheduleStatus;   // Status atual do agendamento
  observations?: string;    // Observações adicionais
  photos?: string[];        // URLs das fotos enviadas
  completedAt?: Date;       // Data de conclusão
  createdAt: Date;          // Data de criação
  updatedAt: Date;          // Última atualização
}

// Interface para logs de auditoria
export interface AuditLog {
  id: string;               // ID único do log
  userId: string;           // ID do usuário que fez a ação
  user: User;               // Dados do usuário
  action: string;           // Descrição da ação
  entity: 'schedule' | 'user' | 'equipment'; // Tipo de entidade afetada
  entityId: string;         // ID da entidade
  oldValue?: any;           // Valor anterior (para edições)
  newValue?: any;           // Novo valor (para edições)
  ipAddress?: string;       // IP do usuário
  createdAt: Date;          // Data/hora da ação
}

// Interface para relatórios
export interface ReportData {
  totalSchedules: number;           // Total de agendamentos
  completedSchedules: number;       // Agendamentos concluídos
  pendingSchedules: number;         // Agendamentos pendentes
  cancelledSchedules: number;       // Agendamentos cancelados
  averageCompletionTime: number;    // Tempo médio de conclusão (em horas)
  schedulesByTechnician: {          // Agendamentos por técnico
    technicianId: string;
    technicianName: string;
    total: number;
    completed: number;
  }[];
  schedulesByRepresentative: {      // Agendamentos por representante
    representativeId: string;
    representativeName: string;
    total: number;
  }[];
  schedulesByStatus: {              // Distribuição por status
    status: ScheduleStatus;
    count: number;
  }[];
}

// Interface para filtros de pesquisa
export interface SearchFilters {
  dateFrom?: Date;          // Data inicial
  dateTo?: Date;            // Data final
  status?: ScheduleStatus;  // Filtro por status
  technicianId?: string;    // Filtro por técnico
  representativeId?: string; // Filtro por representante
  search?: string;          // Busca por texto (nome cliente, etc)
}
