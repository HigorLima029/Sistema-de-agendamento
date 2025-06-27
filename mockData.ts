
import { Schedule, Customer, Equipment, ScheduleStatus, UserType, User } from '@/types/system';

// Dados simulados para demonstração do sistema
// Em produção, estes dados viriam de uma API/banco de dados

// Usuários do sistema
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'admin@rastreador.com',
    type: UserType.ADMIN,
    phone: '(11) 99999-9999',
    createdAt: new Date('2024-01-01'),
    isActive: true
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'representante@rastreador.com',
    type: UserType.REPRESENTATIVE,
    phone: '(11) 88888-8888',
    createdAt: new Date('2024-01-15'),
    isActive: true
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'tecnico1@rastreador.com',
    type: UserType.TECHNICIAN,
    phone: '(11) 77777-7777',
    createdAt: new Date('2024-02-01'),
    isActive: true
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'tecnico2@rastreador.com',
    type: UserType.TECHNICIAN,
    phone: '(11) 66666-6666',
    createdAt: new Date('2024-02-15'),
    isActive: true
  }
];

// Clientes do sistema
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Empresa ABC Ltda',
    phone: '(11) 3333-4444',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    vehicle: {
      plate: 'ABC-1234',
      model: 'Corolla',
      brand: 'Toyota',
      year: 2022
    }
  },
  {
    id: '2',
    name: 'José Pereira',
    phone: '(11) 9999-8888',
    address: 'Av. Paulista, 456 - São Paulo/SP',
    vehicle: {
      plate: 'XYZ-9876',
      model: 'Civic',
      brand: 'Honda',
      year: 2023
    }
  },
  {
    id: '3',
    name: 'Transportadora XYZ',
    phone: '(11) 7777-6666',
    address: 'Rua Industrial, 789 - Guarulhos/SP',
    vehicle: {
      plate: 'TRK-5555',
      model: 'Accelo',
      brand: 'Mercedes-Benz',
      year: 2021
    }
  }
];

// Equipamentos/rastreadores
export const mockEquipments: Equipment[] = [
  {
    id: '1',
    serialNumber: 'TRK001234',
    model: 'GPS Pro 4G',
    status: 'assigned',
    assignedTo: '3'
  },
  {
    id: '2',
    serialNumber: 'TRK005678',
    model: 'GPS Basic 3G',
    status: 'installed'
  },
  {
    id: '3',
    serialNumber: 'TRK009876',
    model: 'GPS Pro 4G',
    status: 'available'
  },
  {
    id: '4',
    serialNumber: 'TRK004321',
    model: 'GPS Advanced 5G',
    status: 'assigned',
    assignedTo: '4'
  }
];

// Agendamentos do sistema
export const mockSchedules: Schedule[] = [
  {
    id: '1',
    date: new Date(2024, 5, 25), // 25 de junho de 2024
    time: '09:00',
    customerId: '1',
    customer: mockCustomers[0],
    technicianId: '3',
    technician: mockUsers[2],
    representativeId: '2',
    representative: mockUsers[1],
    equipmentId: '1',
    equipment: mockEquipments[0],
    status: ScheduleStatus.SCHEDULED,
    observations: 'Cliente solicitou instalação no período da manhã. Veículo estará disponível no pátio.',
    createdAt: new Date('2024-06-20T10:00:00.000Z'),
    updatedAt: new Date('2024-06-20T10:00:00.000Z')
  },
  {
    id: '2',
    date: new Date(2024, 5, 25), // 25 de junho de 2024
    time: '14:30',
    customerId: '2',
    customer: mockCustomers[1],
    technicianId: '4',
    technician: mockUsers[3],
    representativeId: '2',
    representative: mockUsers[1],
    equipmentId: '4',
    equipment: mockEquipments[3],
    status: ScheduleStatus.IN_PROGRESS,
    observations: 'Instalação em veículo particular. Cliente aguardará no local.',
    createdAt: new Date('2024-06-21T14:00:00.000Z'),
    updatedAt: new Date('2024-06-21T15:30:00.000Z')
  },
  {
    id: '3',
    date: new Date(2024, 5, 24), // 24 de junho de 2024
    time: '08:00',
    customerId: '3',
    customer: mockCustomers[2],
    technicianId: '3',
    technician: mockUsers[2],
    representativeId: '2',
    representative: mockUsers[1],
    equipmentId: '2',
    equipment: mockEquipments[1],
    status: ScheduleStatus.COMPLETED,
    observations: 'Instalação em caminhão da frota. Concluída com sucesso.',
    completedAt: new Date('2024-06-24T10:30:00.000Z'),
    createdAt: new Date('2024-06-20T16:00:00.000Z'),
    updatedAt: new Date('2024-06-24T10:30:00.000Z')
  },
  {
    id: '4',
    date: new Date(2024, 5, 26), // 26 de junho de 2024
    time: '16:00',
    customerId: '1',
    customer: mockCustomers[0],
    technicianId: '3',
    technician: mockUsers[2],
    representativeId: '2',
    representative: mockUsers[1],
    equipmentId: '3',
    equipment: mockEquipments[2],
    status: ScheduleStatus.PENDING,
    observations: 'Aguardando confirmação do cliente para o horário.',
    createdAt: new Date('2024-06-22T09:00:00.000Z'),
    updatedAt: new Date('2024-06-22T09:00:00.000Z')
  }
];

// Função para gerar dados de relatório baseados nos agendamentos
export const generateReportData = () => {
  const totalSchedules = mockSchedules.length;
  const completedSchedules = mockSchedules.filter(s => s.status === ScheduleStatus.COMPLETED).length;
  const pendingSchedules = mockSchedules.filter(s => s.status === ScheduleStatus.PENDING).length;
  const cancelledSchedules = mockSchedules.filter(s => s.status === ScheduleStatus.CANCELLED).length;

  // Calcula agendamentos por técnico
  const schedulesByTechnician = mockUsers
    .filter(user => user.type === UserType.TECHNICIAN)
    .map(technician => {
      const techSchedules = mockSchedules.filter(s => s.technicianId === technician.id);
      return {
        technicianId: technician.id,
        technicianName: technician.name,
        total: techSchedules.length,
        completed: techSchedules.filter(s => s.status === ScheduleStatus.COMPLETED).length
      };
    });

  // Calcula agendamentos por representante
  const schedulesByRepresentative = mockUsers
    .filter(user => user.type === UserType.REPRESENTATIVE)
    .map(rep => {
      const repSchedules = mockSchedules.filter(s => s.representativeId === rep.id);
      return {
        representativeId: rep.id,
        representativeName: rep.name,
        total: repSchedules.length
      };
    });

  // Distribui agendamentos por status
  const schedulesByStatus = Object.values(ScheduleStatus).map(status => ({
    status,
    count: mockSchedules.filter(s => s.status === status).length
  }));

  return {
    totalSchedules,
    completedSchedules,
    pendingSchedules,
    cancelledSchedules,
    averageCompletionTime: 2.5, // Tempo médio simulado em horas
    schedulesByTechnician,
    schedulesByRepresentative,
    schedulesByStatus
  };
};
