$RESOURCE_GROUP="estufa-rg"
$LOCATION="switzerlandnorth"
$ACCOUNT_NAME="estufa-db-$(Get-Random)"
$DATABASE_NAME="ESTufaDB"

Write-Host "1/7 - A criar o Resource Group ($RESOURCE_GROUP)..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

Write-Host "2/7 - A criar a conta Azure Cosmos DB ($ACCOUNT_NAME)..."
az cosmosdb create --name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --locations regionName=$LOCATION failoverPriority=0 isZoneRedundant=False --capabilities EnableServerless --output none

Write-Host "3/7 - A configurar regras CORS para o frontend..."
az resource update --resource-group $RESOURCE_GROUP --name $ACCOUNT_NAME --resource-type Microsoft.DocumentDB/databaseAccounts --set properties.cors='[{\"allowedOrigins\":\"*\"}]' --output none

Write-Host "4/7 - A criar a Base de Dados ($DATABASE_NAME)..."
az cosmosdb sql database create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --name $DATABASE_NAME --output none

Write-Host "5/7 - A criar o Contentor Utilizadores..."
az cosmosdb sql container create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --database-name $DATABASE_NAME --name "Utilizadores" --partition-key-path "/userId" --output none

Write-Host "6/7 - A criar o Contentor PlantasFeed..."
az cosmosdb sql container create --account-name $ACCOUNT_NAME --resource-group $RESOURCE_GROUP --database-name $DATABASE_NAME --name "PlantasFeed" --partition-key-path "/id" --output none

# 7. Criar Storage Account (necessário para a Function e requisito do projeto)
$STORAGE_NAME="estufastorage$(Get-Random)"
Write-Host "7/9 - A criar a Storage Account ($STORAGE_NAME)..."
az storage account create --name $STORAGE_NAME --location $LOCATION --resource-group $RESOURCE_GROUP --sku Standard_LRS --output none

# 8. Criar a Function App
$FUNCTION_APP_NAME="estufa-functions-$(Get-Random)"
Write-Host "8/9 - A criar a Function App ($FUNCTION_APP_NAME)..."
az functionapp create --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --storage-account $STORAGE_NAME --consumption-plan-location $LOCATION --runtime node --runtime-version 20 --functions-version 4 --os-type Linux --output none

# 9. Mover a Connection String do Front-end para a Function
Write-Host "9/9 - A configurar a Connection String..."
az functionapp config appsettings set --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --settings "COSMOS_CONNECTION_STRING=$CONN_STRING" --output none

Write-Host "Sucesso! Recurso Function App criado e configurado."