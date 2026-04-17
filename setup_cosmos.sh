#!/bin/bash

# ==========================================
# Script de Automação ESTufa - Cosmos DB + .env
# ==========================================

RESOURCE_GROUP="estufa-rg"
LOCATION="westeurope"
ACCOUNT_NAME="estufa-db-$RANDOM" 
DATABASE_NAME="ESTufaDB"

echo "🌱 A iniciar a criação da infraestrutura para a ESTufa..."

# 1. Criar o Resource Group
echo "📦 1/7 - A criar o Resource Group ($RESOURCE_GROUP)..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

# 2. Criar a conta do Cosmos DB (Modo Serverless)
echo "☁️ 2/7 - A criar a conta Azure Cosmos DB ($ACCOUNT_NAME)..."
az cosmosdb create \
    --name $ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --locations regionName=$LOCATION failoverPriority=0 isZoneRedundant=False \
    --capabilities EnableServerless \
    --output none

# 3. Configurar o CORS (Permitir comunicações do Front-end)
echo "🌐 3/7 - A configurar regras CORS (Permitir '*')..."
az resource update \
    --resource-group $RESOURCE_GROUP \
    --name $ACCOUNT_NAME \
    --resource-type Microsoft.DocumentDB/databaseAccounts \
    --set properties.cors="[{'allowedOrigins':'*'}]" \
    --output none

# 4. Criar a Base de Dados
echo "🗄️ 4/7 - A criar a Base de Dados ($DATABASE_NAME)..."
az cosmosdb sql database create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --name $DATABASE_NAME --output none

# 5. Criar os Contentores
echo "📂 5/7 - A criar o Contentor 'Utilizadores'..."
az cosmosdb sql container create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --database-name $DATABASE_NAME --name "Utilizadores" --partition-key-path "/userId" --output none

echo "📂 6/7 - A criar o Contentor 'PlantasFeed'..."
az cosmosdb sql container create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --database-name $DATABASE_NAME --name "PlantasFeed" --partition-key-path "/id" --output none

# 6. Obter a Connection String e atualizar o ficheiro .env
echo "📝 7/7 - A atualizar o ficheiro .env..."
CONN_STRING=$(az cosmosdb keys list --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --type connection-strings --query "connectionStrings[0].connectionString" --output tsv)

# Verifica se o ficheiro .env existe, se não, cria-o
if [ ! -f .env ]; then
    touch .env
fi

# Se a variável já existir no .env, substitui. Se não existir, adiciona ao fim do ficheiro.
if grep -q "VITE_COSMOS_CONNECTION_STRING" .env; then
    # Usamos o caractere | como delimitador no sed porque a connection string contém barras /
    sed -i "s|VITE_COSMOS_CONNECTION_STRING=.*|VITE_COSMOS_CONNECTION_STRING=\"$CONN_STRING\"|" .env
else
    echo "VITE_COSMOS_CONNECTION_STRING=\"$CONN_STRING\"" >> .env
fi

echo ""
echo "✅ Concluído com Sucesso!"
echo "🚀 A infraestrutura foi criada e o teu ficheiro .env foi atualizado automaticamente."
echo "----------------------------------------------------------------------"
grep "VITE_COSMOS_CONNECTION_STRING" .env
echo "----------------------------------------------------------------------"