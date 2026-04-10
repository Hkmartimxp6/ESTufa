/// <reference types="vite/client" />
import { CosmosClient, User } from "@azure/cosmos";

const connectionString = import.meta.env.VITE_COSMOS_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("A Connection String não foi encontrada no ficheiro .env!");
}

const client = new CosmosClient(connectionString);

// Definir a estrutura exata do Utilizador baseada nos vossos componentes
export interface UtilizadorESTufa {
  id: string;          // Obrigatório para o Cosmos DB
  userId: string;      // A nossa Partition Key
  username: string;
  fullName: string;
  email: string;
  password: string;    // Nota: A ser encriptado no futuro via Azure Functions
  bio: string;
  avatarUrl: string;   // Para usar no Profile.tsx
  dataRegisto: string;
}

// Criar um tipo para os dados que vêm do formulário (omitimos os que geramos automaticamente)
type DadosFormulario = Omit<UtilizadorESTufa, 'id' | 'userId' | 'dataRegisto' | 'avatarUrl'>;

export const registarUtilizador = async (dados: DadosFormulario) => {
  try {
    console.log("1. A verificar/criar a Base de Dados ESTufaDB...");
    const { database } = await client.databases.createIfNotExists({ id: "ESTufaDB" });
    
    console.log("2. A verificar/criar o Contentor Utilizadores...");
    const { container } = await database.containers.createIfNotExists({
      id: "Utilizadores", 
      partitionKey: { paths: ["/userId"] }
    });

    console.log("3. A preparar os dados do utilizador...");
    // Usamos o username em minúsculas como ID único
    const formatId = dados.username.toLowerCase().trim();
    
    // Construir o objeto final que vai para a base de dados
    const novoUtilizador: UtilizadorESTufa = {
      id: formatId,
      userId: formatId,
      username: dados.username,
      fullName: dados.fullName || "",
      email: dados.email || "",
      password: dados.password,
      bio: dados.bio || "",
      avatarUrl: "", // Começa vazio, o utilizador pode editar depois
      dataRegisto: new Date().toISOString()
    };

    console.log("4. A guardar no Cosmos DB...");
    const { resource } = await container.items.upsert(novoUtilizador);
    
    console.log("Sucesso! Utilizador registado:", resource?.username);
    return resource;
    
  } catch (error) {
    console.error("ERRO DETETADO AO LIGAR À DB:", error);
    throw error; 
  }
};

export const verificarLogin = async (username: string, passwordInserida: string) => {
  try {
    const database = client.database("ESTufaDB");
    const container = database.container("Utilizadores");
    const formatId = username.toLowerCase().trim();

    // Procurar o utilizador pelo ID
    const { resource: utilizador } = await container.item(formatId, formatId).read<UtilizadorESTufa>();

    if (!utilizador) {
      return { sucesso: false, erro: "Utilizador não encontrado." };
    }

    if (utilizador.password !== passwordInserida) {
      return { sucesso: false, erro: "Password incorreta." };
    }

    return { sucesso: true, utilizador };
  } catch (error) {
    console.error("Erro ao verificar login:", error);
    return { sucesso: false, erro: "Erro ao comunicar com a base de dados." };
  }
};

export const atualizarUtilizadorNoCosmos = async (userId: string, dadosAtualizados: Partial<User>) => {
  try {
    const database = client.database("ESTufaDB");
    const container = database.container("Utilizadores");

    // Lemos o documento atual para garantir que não perdemos campos não editados
    const { resource: atual } = await container.item(userId, userId).read();
    
    // Fundimos os dados antigos com os novos
    const documentoFinal = { ...atual, ...dadosAtualizados };
    
    // O upsert substitui o documento se o ID for o mesmo
    const { resource } = await container.items.upsert(documentoFinal);
    
    console.log("✅ Dados atualizados na Cloud com sucesso!");
    return resource;
  } catch (error) {
    console.error("❌ Erro ao atualizar no Cosmos DB:", error);
    throw error;
  }
};