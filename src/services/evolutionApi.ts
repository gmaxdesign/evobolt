export interface CreateInstanceRequest {
  instanceName: string;
  token: string;
  qrcode: boolean;
}

export interface InstanceResponse {
  instance: {
    instanceName: string;
    owner: string;
    profileName: string;
    profilePictureUrl: string;
    profileStatus: string;
    status: string;
    serverUrl: string;
    apikey: string;
  };
}

export interface QRCodeResponse {
  code: string;
  base64: string;
}

class EvolutionApiService {
  private baseUrl = 'https://evo.hubhosting.cloud';
  private globalKey = 'GAP7bvhm0cacdTv';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.globalKey,
    };
  }

  async createInstance(data: CreateInstanceRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating instance:', error);
      throw error;
    }
  }

  async fetchInstances(instanceName?: string): Promise<InstanceResponse[]> {
    try {
      const url = new URL(`${this.baseUrl}/instance/fetchInstances`);
      if (instanceName) {
        url.searchParams.append('instanceName', instanceName);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching instances:', error);
      throw error;
    }
  }

  async connectInstance(instanceName: string): Promise<QRCodeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/connect/${instanceName}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error connecting instance:', error);
      throw error;
    }
  }

  async restartInstance(instanceName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/restart/${instanceName}`, {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error restarting instance:', error);
      throw error;
    }
  }

  async getConnectionState(instanceName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/connectionState/${instanceName}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting connection state:', error);
      throw error;
    }
  }

  async logoutInstance(instanceName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/logout/${instanceName}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging out instance:', error);
      throw error;
    }
  }

  async deleteInstance(instanceName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/instance/delete/${instanceName}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting instance:', error);
      throw error;
    }
  }
}

export const evolutionApi = new EvolutionApiService();