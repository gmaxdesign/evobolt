import React, { useState, useEffect } from 'react';
import { X, QrCode, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { evolutionApi } from '../../services/evolutionApi';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceName: string;
  onConnectionSuccess: () => void;
}

export function QRCodeModal({ isOpen, onClose, instanceName, onConnectionSuccess }: QRCodeModalProps) {
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  const fetchQRCode = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await evolutionApi.connectInstance(instanceName);
      if (response.base64) {
        setQrCode(response.base64);
        startConnectionPolling();
      }
    } catch (error) {
      setError('Erro ao gerar QR Code. Tente novamente.');
      console.error('Error fetching QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startConnectionPolling = () => {
    const interval = setInterval(async () => {
      try {
        const status = await evolutionApi.getConnectionState(instanceName);
        if (status.state === 'open') {
          setConnectionStatus('connected');
          clearInterval(interval);
          setTimeout(() => {
            onConnectionSuccess();
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking connection status:', error);
      }
    }, 3000);

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(interval), 300000);
  };

  useEffect(() => {
    if (isOpen && instanceName) {
      fetchQRCode();
    }
  }, [isOpen, instanceName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Conectar WhatsApp</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {connectionStatus === 'connected' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Conectado com Sucesso!</h3>
                <p className="text-gray-600">Sua instância está pronta para uso.</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Erro na Conexão</h3>
                <p className="text-gray-600">{error}</p>
              </div>
              <button
                onClick={fetchQRCode}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Escaneie o QR Code
                </h3>
                <p className="text-gray-600 text-sm">
                  Abra o WhatsApp no seu celular e escaneie o código abaixo
                </p>
              </div>

              <div className="flex justify-center">
                {isLoading ? (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : qrCode ? (
                  <img
                    src={`data:image/png;base64,${qrCode}`}
                    alt="QR Code"
                    className="w-64 h-64 border border-gray-200 rounded-lg"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Como conectar:</strong>
                </p>
                <ol className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>1. Abra o WhatsApp no seu celular</li>
                  <li>2. Toque em "Mais opções" (⋮) e depois em "Aparelhos conectados"</li>
                  <li>3. Toque em "Conectar um aparelho"</li>
                  <li>4. Aponte a câmera para este QR code</li>
                </ol>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={fetchQRCode}
                  disabled={isLoading}
                  className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Atualizar QR Code</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}