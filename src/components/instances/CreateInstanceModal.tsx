import React, { useState } from 'react';
import { X, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { evolutionApi } from '../../services/evolutionApi';

interface CreateInstanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstanceCreated: () => void;
}

export function CreateInstanceModal({ isOpen, onClose, onInstanceCreated }: CreateInstanceModalProps) {
  const [instanceName, setInstanceName] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await evolutionApi.createInstance({
        instanceName,
        token,
        qrcode: true,
      });

      onInstanceCreated();
      onClose();
      setInstanceName('');
      setToken('');
    } catch (error) {
      setError('Erro ao criar instância. Verifique os dados e tente novamente.');
      console.error('Error creating instance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateToken = () => {
    const token = crypto.randomUUID();
    setToken(token);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Nova Instância</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Instância
            </label>
            <input
              id="instanceName"
              type="text"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ex: minha-empresa"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use apenas letras minúsculas, números e hífens
            </p>
          </div>

          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
              Token de Segurança
            </label>
            <div className="flex space-x-2">
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder="Token único para sua instância"
              />
              <button
                type="button"
                onClick={generateToken}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Gerar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Token usado para autenticação da API
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Próximos passos:</strong> Após criar a instância, você receberá um QR Code para conectar seu WhatsApp.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Instância'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}