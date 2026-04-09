/// <reference types="vite/client" />
import { CosmosClient } from "@azure/cosmos";

const connectionString = import.meta.env.VITE_COSMOS_CONNECTION_STRING;

if (!connectionString) {
  console.error("A Connection String não foi encontrada no ficheiro .env!");
}

const client = new CosmosClient(connectionString);

export const registarUtilizador = async (username: string) => {
  try {
    console.log("1. A verificar/criar a Base de Dados ESTufaDB...");
    // Tenta ligar, se não existir, o teu código cria logo uma nova!
    const { database } = await client.databases.createIfNotExists({ id: "ESTufaDB" });
    
    console.log("2. A verificar/criar o Contentor Utilizadores...");
    // Tenta ligar à pasta, se não existir, cria-a com as definições certas!
    const { container } = await database.containers.createIfNotExists({
      id: "Utilizadores", 
      partitionKey: { paths: ["/userId"] }
    });

    console.log("3. Infraestrutura pronta! A preparar dados...");
    const formatName = username.toLowerCase().trim();
    
    const novoUtilizador = {
      id: formatName,
      userId: formatName,
      nomeOriginal: username,
      dataRegisto: new Date().toISOString()
    };

    console.log("4. A enviar para o Cosmos...");
    const { resource } = await container.items.upsert(novoUtilizador);
    
    console.log(" Sucesso! Utilizador registado na Nuvem:", resource?.id);
    return resource;
    
  } catch (error) {
    console.error(" ERRO DETETADO:", error);
    throw error; 
  }
};