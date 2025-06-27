
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, mockCustomers, mockEquipments } from '@/data/mockData';
import { UserType, ScheduleStatus } from '@/types/system';

interface ScheduleFormDialogProps {
  onScheduleCreated?: () => void;
}

export const ScheduleFormDialog = ({ onScheduleCreated }: ScheduleFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    customerId: '',
    technicianId: '',
    equipmentId: '',
    observations: ''
  });

  const technicians = mockUsers.filter(user => user.type === UserType.TECHNICIAN);
  const availableEquipments = mockEquipments.filter(eq => eq.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.date || !formData.time || !formData.customerId || !formData.technicianId || !formData.equipmentId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Simular criação do agendamento
    console.log('Criando novo agendamento:', formData);
    
    toast({
      title: "Sucesso!",
      description: "Agendamento criado com sucesso.",
    });

    // Reset form
    setFormData({
      date: '',
      time: '',
      customerId: '',
      technicianId: '',
      equipmentId: '',
      observations: ''
    });

    setOpen(false);
    onScheduleCreated?.();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-tracker-blue-600 hover:bg-tracker-blue-700">
          <Calendar className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-tracker-blue-600" />
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente *</Label>
            <Select value={formData.customerId} onValueChange={(value) => handleInputChange('customerId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Técnico */}
          <div className="space-y-2">
            <Label htmlFor="technician">Técnico *</Label>
            <Select value={formData.technicianId} onValueChange={(value) => handleInputChange('technicianId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um técnico" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.name} - {technician.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipamento */}
          <div className="space-y-2">
            <Label htmlFor="equipment">Equipamento *</Label>
            <Select value={formData.equipmentId} onValueChange={(value) => handleInputChange('equipmentId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um equipamento" />
              </SelectTrigger>
              <SelectContent>
                {availableEquipments.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.model} - {equipment.serialNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              placeholder="Observações adicionais sobre o agendamento..."
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-tracker-blue-600 hover:bg-tracker-blue-700">
              Criar Agendamento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
