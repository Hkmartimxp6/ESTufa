# ==========================================
# Script de Automação ESTufa - Cosmos DB (PowerShell)
# ==========================================

$RESOURCE_GROUP="estufa-rg"
$LOCATION="westeurope"
$ACCOUNT_NAME="estufa-db-$(Get-Random)"
$DATABASE_NAME="ESTufaDB"

Write-Host "🌱 A iniciar a criacao da infraestrutura para a ESTufa..." -ForegroundColor Green

# 1. Criar o Resource Group
Write-Host "📦 1/7 - A criar o Resource Group ($RESOURCE_GROUP)..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

# 2. Criar a conta do Cosmos DB (Modo Serverless)
Write-Host "☁️ 2/7 - A criar a conta Azure Cosmos DB ($ACCOUNT_NAME)..."
az cosmosdb create --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --locations regionName=$LOCATION failoverPriority=0 isZoneRedundant=False --capabilities EnableServerless --output none

# 3. Configurar o CORS
Write-Host "🌐 3/7 - A configurar regras CORS (Permitir '*')..."
az resource update --resource-group $RESOURCE_GROUP --name $ACCOUNT_NAME --resource-type Microsoft.DocumentDB/databaseAccounts --set properties.cors="[{'allowedOrigins':'*'}]" --output none

# 4. Criar a Base de Dados
Write-Host "🗄️ 4/7 - A criar a Base de Dados ($DATABASE_NAME)..."
az cosmosdb sql database create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --name $DATABASE_NAME --output none

# 5. Criar os Contentores
Write-Host "📂 5/7 - A criar o Contentor 'Utilizadores'..."
az cosmosdb sql container create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --database-name $DATABASE_NAME --name "Utilizadores" --partition-key-path "/userId" --output none

Write-Host "📂 6/7 - A criar o Contentor 'PlantasFeed'..."
az cosmosdb sql container create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --database-name $DATABASE_NAME --name "PlantasFeed" --partition-key-path "/id" --output none

# 6. Obter a Connection String e atualizar o ficheiro .env
Write-Host "📝 7/7 - A atualizar o ficheiro .env..."
$CONN_STRING = az cosmosdb keys list --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --type connection-strings --query "connectionStrings[0].connectionString" --output tsv

$envFile = ".env"
if (-Not (Test-Path $envFile)) {
    New-Item -Path $envFile -ItemType File | Out-Null
}

$envContent = Get-Content $envFile -Raw
if ($envContent -match "VITE_COSMOS_CONNECTION_STRING") {
    (Get-Content $envFile) -replace '^VITE_COSMOS_CONNECTION_STRING=.*', "VITE_COSMOS_CONNECTION_STRING=`"$CONN_STRING`"" | Set-Content $envFile
} else {
    Add-Content -Path $envFile -Value "VITE_COSMOS_CONNECTION_STRING=`"$CONN_STRING`""
}

Write-Host "`n✅ Concluido com Sucesso!" -ForegroundColor Green
Write-Host "🚀 A infraestrutura foi criada e o teu ficheiro .env foi atualizado automaticamente."