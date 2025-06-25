import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { InstanceCard } from '../components/instances/InstanceCard';
import { CreateInstanceModal } from '../components/instances/CreateInstanceModal';
import { QRCodeModal } from '../components/instances/QRCodeModal';
import { OverviewCard } from '../components/dashboard/OverviewCard';
import { MessageSquare, Activity, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useInstances } from '../hooks/useInstances';

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const { user } = useAuth();
  
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

  const handleToggleConnection = async (instanceId: string) => {
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;

    try {
      if (instance.status === 'connected') {
        await disconnectInstance(instanceId);
      } else {
        setSelectedInstance(instanceId);
        setShowQRModal(true);
      }
    } catch (error) {
      console.error('Error toggling connection:', error);
    }
  };

  const handleDeleteInstance = async (instanceId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta instância?')) {
      try {
        await deleteInstance(instanceId);
      } catch (error) {
        console.error('Error deleting instance:', error);
      }
    }
  };

  const handleRestartInstance = async (instanceId: string) => {
    try {
      await restartInstance(instanceId);
    } catch (error) {
      console.error('Error restarting instance:', error);
    }
  };

  const handleShowQRCode = (instanceId: string) => {
    setSelectedInstance(instanceId);
    setShowQRModal(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Painel do Cliente</h2>
        <p className="text-gray-600">Bem-vindo, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Instâncias Ativas"
          value={connectedInstances}
          icon={MessageSquare}
          color="green"
          change={{ value: `${instances.length} total`, isPositive: true }}
        />
        <OverviewCard
          title="Total de Mensagens"
          value={totalMessages.toLocaleString()}
          icon={Activity}
          color="blue"
          change={{ value: '+1.2k hoje', isPositive: true }}
        />
        <OverviewCard
          title="Tempo Médio Resposta"
          value="2.3s"
          icon={Clock}
          color="purple"
          change={{ value: '-0.5s', isPositive: true }}
        />
        <OverviewCard
          title="Taxa de Entrega"
          value="98.5%"
          icon={TrendingUp}
          color="orange"
          change={{ value: '+0.3%', isPositive: true }}
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
                <span className="text-xs text-gray-500">{instance.lastActivity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Instâncias</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conectadas</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
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
                <div className="w-24 bg-gray-200 rounded-full h-2">
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

  const renderInstances = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Minhas Instâncias</h2>
          <p className="text-gray-600">Gerencie suas instâncias do WhatsApp Business API</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Instância</span>
        </button>
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
              onDelete={handleDeleteInstance}
              onRestart={handleRestartInstance}
              onShowQRCode={handleShowQRCode}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Webhooks</h2>
        <p className="text-gray-600">Configure endpoints para receber eventos das suas instâncias</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Funcionalidade de Webhooks em desenvolvimento</p>
      </div>
    </div>
  );

  const renderTokens = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Meus Tokens</h2>
        <p className="text-gray-600">Gerencie seus tokens de acesso à API</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Gerenciamento de Tokens em desenvolvimento</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'instances':
        return renderInstances();
      case 'webhooks':
        return renderWebhooks();
      case 'tokens':
        return renderTokens();
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

      <CreateInstanceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onInstanceCreated={fetchInstances}
      />

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        instanceName={selectedInstance}
        onConnectionSuccess={fetchInstances}
      />
    </div>
  );
}