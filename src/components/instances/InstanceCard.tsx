import React, { useState } from 'react';
import { MessageSquare, MoreHorizontal, Power, Trash2, Settings, QrCode, RefreshCw, Copy, Check } from 'lucide-react';
import { Instance } from '../../types';

interface InstanceCardProps {
  instance: Instance;
  onToggleConnection: (id: string) => void;
  onDelete?: (id: string) => void;
  onRestart?: (id: string) => void;
  onShowQRCode?: (id: string) => void;
  showActions?: boolean;
}

export function InstanceCard({ 
  instance, 
  onToggleConnection, 
  onDelete, 
  onRestart,
  onShowQRCode,
  showActions = true 
}: InstanceCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectada';
      case 'disconnected':
        return 'Desconectada';
      case 'connecting':
        return 'Conectando';
      default:
        return 'Desconhecido';
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              {instance.profilePictureUrl ? (
                <img 
                  src={instance.profilePictureUrl} 
                  alt={instance.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <MessageSquare className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{instance.name}</h3>
              <p className="text-sm text-gray-500">{instance.category}</p>
              {instance.profileStatus && (
                <p className="text-xs text-gray-400 mt-1">{instance.profileStatus}</p>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                  {instance.status === 'disconnected' && onShowQRCode && (
                    <button 
                      onClick={() => {
                        onShowQRCode(instance.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Mostrar QR Code
                    </button>
                  )}
                  {onRestart && (
                    <button 
                      onClick={() => {
                        onRestart(instance.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reiniciar
                    </button>
                  )}
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(instance.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instance ID */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
              {instance.id}
            </span>
            <button 
              onClick={() => copyToClipboard(instance.id)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-900">{instance.phone}</p>
        </div>

        {/* Stats */}
        <div className="flex space-x-4 mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{instance.messagesIn}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>{instance.messagesOut}</span>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(instance.status)}`}>
              <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></span>
              {getStatusText(instance.status)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={instance.status === 'connected'}
                onChange={() => onToggleConnection(instance.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
            
            <button
              onClick={() => onToggleConnection(instance.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                instance.status === 'connected'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <Power className="w-4 h-4 inline mr-1" />
              {instance.status === 'connected' ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}