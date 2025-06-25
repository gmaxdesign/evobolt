import React from 'react';
import { BarChart3, MessageSquare, Webhook, Key, Users, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();

  const adminTabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'instances', label: 'Instâncias', icon: MessageSquare },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
  ];

  const clientTabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'instances', label: 'Minhas Instâncias', icon: MessageSquare },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'tokens', label: 'Meus Tokens', icon: Key },
  ];

  const tabs = user?.role === 'admin' ? adminTabs : clientTabs;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}