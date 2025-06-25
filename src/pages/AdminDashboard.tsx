import React, { useState } from 'react';
import { Users, MessageSquare, Activity, TrendingUp, Search, UserPlus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { InstanceCard } from '../components/instances/InstanceCard';
import { OverviewCard } from '../components/dashboard/OverviewCard';
import { CreateUserModal } from '../components/admin/CreateUserModal';
import { SettingsPanel } from '../components/settings/SettingsPanel';
import { useInstances } from '../hooks/useInstances';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const {
    instances,
    isLoading,
    error,
    fetchInstances,
    connectInstance,
    disconnectInstance,
    deleteInstance,
    restartInstance,
  } = useInstances();

  const filteredInstances = instances.filter(instance =>
    instance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instance.phone.includes(searchTerm) ||
    instance.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const connectedInstances = instances.filter(i => i.status === 'connected').length;
  const totalMessages = instances.reduce((sum, i) => sum + i.messagesIn + i.messagesOut, 0);
  const totalClients = users.length;

  const handleToggleConnection = async (instanceId: string) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;

    try {
      if (instance.status === 'connected') {
        await disconnectInstance(instanceId);
      } else {
        await connectInstance(instanceId);
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
    }
  };

  const handleUserCreated = (newUser: any) => {
    setUsers(prev => [...prev, newUser]);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
        <p className="text-gray-600">Visão geral completa da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Total de Clientes"
          value={totalClients}
          icon={Users}
          color="blue"
          change={{ value: `+${users.filter(u => u.createdAt > new Date(Date.now() - 30*24*60*60*1000).toISOString()).length} este mês`, isPositive: true }}
        />
        <OverviewCard
          title="Instâncias Ativas"
          value={connectedInstances}
          icon={MessageSquare}
          color="green"
          change={{ value: `${instances.length} total`, isPositive: true }}
        />
        <OverviewCard
          title="Mensagens Processadas"
          value={totalMessages.toLocaleString()}
          icon={Activity}
          color="purple"
          change={{ value: '+5.2k hoje', isPositive: true }}
        />
        <OverviewCard
          title="Taxa de Disponibilidade"
          value="99.8%"
          icon={TrendingUp}
          color="orange"
          change={{ value: '+0.1%', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-3">
            {instances.slice(0, 5).map((instance) => (
              <div key={instance.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${instance.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium text-gray-900">{instance.name}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(instance.lastActivity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conectadas</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${instances.length > 0 ? (connectedInstances / instances.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{connectedInstances}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Desconectadas</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${instances.length > 0 ? ((instances.length - connectedInstances) / instances.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{instances.length - connectedInstances}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600">Gerencie todos os clientes da plataforma</p>
        </div>
        <button 
          onClick={() => setShowCreateUserModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
            <p className="text-gray-600 mb-4">Comece criando seu primeiro cliente</p>
            <button 
              onClick={() => setShowCreateUserModal(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Criar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-gray-900">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    user.plan === 'premium' ? 'bg-green-100 text-green-800' :
                    user.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.plan?.charAt(0).toUpperCase() + user.plan?.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instâncias: 0</p>
                  <p className="text-sm text-gray-600">Mensagens: 0</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Membro desde</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderInstances = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Todas as Instâncias</h2>
        <p className="text-gray-600">Monitore todas as instâncias da plataforma</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar instâncias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={fetchInstances}
            className="mt-2 text-red-600 hover:text-red-800 font-medium"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstances.map((instance) => (
            <InstanceCard
              key={instance.id}
              instance={instance}
              onToggleConnection={handleToggleConnection}
              showActions={false}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'clients':
        return renderClients();
      case 'instances':
        return renderInstances();
      case 'settings':
        return <SettingsPanel />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      <CreateUserModal
        isOpen={showCreateUserModal}
        onClose={() => setShowCreateUserModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}