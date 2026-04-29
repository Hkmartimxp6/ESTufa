import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// URL base da tua API (Azure Functions). 
const API_BASE_URL = (import.meta as any)?.env?.VITE_API_BASE_URL || "http://localhost:7071/api";

// Types
export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  fullName?: string;
  email?: string;
  bio?: string;
}

export interface PlantResult {
  id: string;
  userId: string;
  username: string;
  imageUrl: string;
  plantName: string;
  scientificName: string;
  confidence: number;
  description: string;
  timestamp: string;
}

interface AzureContextType {
  user: User | null;
  feed: PlantResult[];
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, additionalData?: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  detectPlant: (imageUrl: string) => Promise<PlantResult>;
  isLoading: boolean;
}

const AzureContext = createContext<AzureContextType | undefined>(undefined);

// Dados Mock do Feed (mantemos para já até ligarmos o Blob Storage e Contentor de Feed)
const INITIAL_FEED: PlantResult[] = [ /* ... os vossos mocks continuam aqui ... */ ];

export function AzureProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<PlantResult[]>(INITIAL_FEED);
  const [isLoading, setIsLoading] = useState(false);

  // Persistência da sessão via localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('estufa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (username: string, password: string, additionalData?: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Pedido HTTP para a Azure Function de Registo
      const response = await fetch(`${API_BASE_URL}/RegisterUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: username.toLowerCase().trim(),
          userId: username.toLowerCase().trim(),
          username,
          password,
          fullName: additionalData?.fullName || "",
          email: additionalData?.email || "",
          bio: additionalData?.bio || "",
          avatarUrl: "",
          dataRegisto: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        // A Function deve devolver o utilizador criado na propriedade 'user'
        const newUser: User = {
          id: data.user.id,
          username: data.user.username,
          fullName: data.user.fullName,
          email: data.user.email,
          bio: data.user.bio,
          avatarUrl: data.user.avatarUrl,
        };

        setUser(newUser);
        localStorage.setItem('estufa_user', JSON.stringify(newUser));
        return true;
      } else {
        console.error("Erro retornado pela API no registo:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Falha ao contactar a API de registo:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Pedido HTTP para a Azure Function de Login
      const response = await fetch(`${API_BASE_URL}/LoginUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const loggedUser: User = {
          id: data.user.id,
          username: data.user.username,
          fullName: data.user.fullName,
          email: data.user.email,
          bio: data.user.bio,
          avatarUrl: data.user.avatarUrl,
        };

        setUser(loggedUser);
        localStorage.setItem('estufa_user', JSON.stringify(loggedUser));
        return true;
      } else {
        console.error("Credenciais inválidas ou erro na API");
        return false;
      }
    } catch (error) {
      console.error("Falha ao contactar a API de login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estufa_user');
  };

  const updateUser = async (updatedData: Partial<User>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Pedido HTTP para a Azure Function de Atualização
      const response = await fetch(`${API_BASE_URL}/UpdateUser`, {
        method: 'POST', // ou PUT, dependendo de como criares a Function
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          updatedData 
        })
      });

      if (response.ok) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('estufa_user', JSON.stringify(updatedUser));
      } else {
        alert("Não foi possível sincronizar os dados com a base de dados.");
      }
    } catch (error) {
      console.error("Falha ao contactar a API de atualização:", error);
      alert("Erro de ligação à API.");
    } finally {
      setIsLoading(false);
    }
  };

  // Os vossos mocks de uploadImage e detectPlant mantêm-se iguais para já...
  const uploadImage = async (file: File): Promise<string> => { /* ... */ return ""; };
  const detectPlant = async (imageUrl: string): Promise<PlantResult> => { /* ... */ return {} as PlantResult; };

  return (
    <AzureContext.Provider value={{ user, feed, login, register, logout, updateUser, uploadImage, detectPlant, isLoading }}>
      {children}
    </AzureContext.Provider>
  );
}

export function useAzure() {
  const context = useContext(AzureContext);
  if (context === undefined) {
    throw new Error('useAzure must be used within an AzureProvider');
  }
  return context;
}