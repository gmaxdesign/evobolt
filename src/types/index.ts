export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: string;
  plan?: 'basic' | 'premium' | 'enterprise';
}

export interface Instance {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'connecting';
  clientId: string;
  messagesIn: number;
  messagesOut: number;
  createdAt: string;
  lastActivity: string;
  category?: string;
  profilePictureUrl?: string;
  profileStatus?: string;
  serverUrl?: string;
  apikey?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}