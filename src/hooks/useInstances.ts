import { useState, useEffect, useCallback } from 'react';
import { evolutionApi, InstanceResponse } from '../services/evolutionApi';
import { Instance } from '../types';

export function useInstances() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformApiInstance = (apiInstance: InstanceResponse): Instance => {
    return {
      id: apiInstance.instance.instanceName,
      name: apiInstance.instance.profileName || apiInstance.instance.instanceName,
      phone: apiInstance.instance.owner || 'N/A',
      status: apiInstance.instance.status === 'open' ? 'connected' : 'disconnected',
      clientId: '1', // This would come from your user management system
      messagesIn: 0, // These would come from your analytics
      messagesOut: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      category: 'API Instance',
      profilePictureUrl: apiInstance.instance.profilePictureUrl,
      profileStatus: apiInstance.instance.profileStatus,
      serverUrl: apiInstance.instance.serverUrl,
      apikey: apiInstance.instance.apikey,
    };
  };

  const fetchInstances = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiInstances = await evolutionApi.fetchInstances();
      const transformedInstances = apiInstances.map(transformApiInstance);
      setInstances(transformedInstances);
    } catch (err) {
      setError('Erro ao carregar instâncias');
      console.error('Error fetching instances:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectInstance = useCallback(async (instanceName: string) => {
    try {
      await evolutionApi.connectInstance(instanceName);
      await fetchInstances(); // Refresh the list
    } catch (err) {
      console.error('Error connecting instance:', err);
      throw err;
    }
  }, [fetchInstances]);

  const disconnectInstance = useCallback(async (instanceName: string) => {
    try {
      await evolutionApi.logoutInstance(instanceName);
      await fetchInstances(); // Refresh the list
    } catch (err) {
      console.error('Error disconnecting instance:', err);
      throw err;
    }
  }, [fetchInstances]);

  const deleteInstance = useCallback(async (instanceName: string) => {
    try {
      await evolutionApi.deleteInstance(instanceName);
      await fetchInstances(); // Refresh the list
    } catch (err) {
      console.error('Error deleting instance:', err);
      throw err;
    }
  }, [fetchInstances]);

  const restartInstance = useCallback(async (instanceName: string) => {
    try {
      await evolutionApi.restartInstance(instanceName);
      await fetchInstances(); // Refresh the list
    } catch (err) {
      console.error('Error restarting instance:', err);
      throw err;
    }
  }, [fetchInstances]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  return {
    instances,
    isLoading,
    error,
    fetchInstances,
    connectInstance,
    disconnectInstance,
    deleteInstance,
    restartInstance,
  };
}