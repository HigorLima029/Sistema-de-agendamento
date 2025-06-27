
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarDays, Loader2, MapPin } from 'lucide-react';

export const Login = () => {
  // Estados para controlar o formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();

  // Função para processar o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    // Tenta fazer login
    const success = await login(email, password);
    if (!success) {
      setError('E-mail ou senha incorretos');
    }
  };

  // Função para preencher automaticamente com dados de teste
  const fillTestCredentials = (userType: 'admin' | 'representative' | 'technician') => {
    const credentials = {
      admin: { email: 'admin@rastreador.com', password: 'admin123' },
      representative: { email: 'representante@rastreador.com', password: 'rep123' },
      technician: { email: 'tecnico@rastreador.com', password: 'tec123' }
    };

    setEmail(credentials[userType].email);
    setPassword(credentials[userType].password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tracker-blue-900 via-tracker-blue-800 to-tracker-blue-900 flex items-center justify-center p-4">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-tracker-green-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-tracker-green-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Cabeçalho com logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-tracker-green-500 to-tracker-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <CalendarDays className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TrackerPro</h1>
          <p className="text-tracker-blue-100 text-lg">Sistema de Gestão de Instalações</p>
          <div className="flex items-center justify-center mt-2 text-tracker-blue-200">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">Rastreamento e Logística</span>
          </div>
        </div>

        {/* Formulário de login */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-800">
              Acesse sua conta
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Digite suas credenciais para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo de e-mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-200 focus:border-tracker-blue-500 focus:ring-tracker-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Campo de senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-gray-200 focus:border-tracker-blue-500 focus:ring-tracker-blue-500"
                  disabled={isLoading}
                />
              </div>

              {/* Exibe erro se houver */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Botão de login */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-tracker-blue-600 to-tracker-blue-700 hover:from-tracker-blue-700 hover:to-tracker-blue-800 text-white font-medium shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            {/* Credenciais de teste para demonstração */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-3">
                Credenciais de demonstração:
              </p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('admin')}
                  className="text-xs h-8 border-tracker-blue-200 text-tracker-blue-700 hover:bg-tracker-blue-50"
                >
                  Admin: admin@rastreador.com
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('representative')}
                  className="text-xs h-8 border-tracker-green-200 text-tracker-green-700 hover:bg-tracker-green-50"
                >
                  Representante: representante@rastreador.com
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillTestCredentials('technician')}
                  className="text-xs h-8 border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Técnico: tecnico@rastreador.com
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center mt-8 text-tracker-blue-200 text-sm">
          <p>© 2024 TrackerPro. Sistema completo de gestão.</p>
        </div>
      </div>
    </div>
  );
};
