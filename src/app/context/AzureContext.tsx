import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Importamos o nosso serviço do Cosmos DB!
import { atualizarUtilizadorNoCosmos, registarUtilizador, verificarLogin } from '../../services/cosmosService';

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
  // Atualizamos as assinaturas para Promise<boolean>
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, additionalData?: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
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

  // Mantemos a persistência da sessão via localStorage para o utilizador não ter de fazer login sempre
  useEffect(() => {
    const storedUser = localStorage.getItem('estufa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (username: string, password: string, additionalData?: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Chama o Cosmos DB para registar
      const utilizadorCriado = await registarUtilizador({
        username,
        password,
        fullName: additionalData?.fullName || "",
        email: additionalData?.email || "",
        bio: additionalData?.bio || "",
      });

      if (utilizadorCriado) {
        // Mapeia a resposta do CosmosDB para a interface User do Contexto
        const newUser: User = {
          id: utilizadorCriado.id,
          username: utilizadorCriado.username,
          fullName: utilizadorCriado.fullName,
          email: utilizadorCriado.email,
          bio: utilizadorCriado.bio,
          avatarUrl: utilizadorCriado.avatarUrl,
        };

        setUser(newUser);
        localStorage.setItem('estufa_user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Falha no registo:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Chama o Cosmos DB para verificar as credenciais
      const resultado = await verificarLogin(username, password);

      if (resultado.sucesso && resultado.utilizador) {
        const loggedUser: User = {
          id: resultado.utilizador.id,
          username: resultado.utilizador.username,
          fullName: resultado.utilizador.fullName,
          email: resultado.utilizador.email,
          bio: resultado.utilizador.bio,
          avatarUrl: resultado.utilizador.avatarUrl,
        };

        setUser(loggedUser);
        localStorage.setItem('estufa_user', JSON.stringify(loggedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Falha no login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estufa_user');
  };

  // No AzureContext.tsx
const updateUser = async (updatedData: Partial<User>) => {
  if (!user) return;
  
  setIsLoading(true);
  try {
    // 1. Atualiza na Nuvem (Azure Cosmos DB)
    await atualizarUtilizadorNoCosmos(user.id, updatedData);
    
    // 2. Se a cloud responder com sucesso, atualizamos o estado local
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    
    // 3. Atualizamos o cache local
    localStorage.setItem('estufa_user', JSON.stringify(updatedUser));
  } catch (error) {
    alert("Não foi possível sincronizar os dados com a base de dados.");
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