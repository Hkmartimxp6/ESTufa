# ESTufa 🌿

[cite_start]**ESTufa** é uma aplicação web baseada na plataforma Microsoft Azure, dedicada à identificação de espécies botânicas com recurso à inteligência artificial[cite: 15]. [cite_start]Desenvolvida para ser uma ferramenta indispensável no cuidado e conhecimento da biodiversidade botânica[cite: 55].

## 📖 Sobre o Projeto
[cite_start]A ferramenta permite aos utilizadores submeter fotografias de plantas para obter, de forma imediata, a sua identificação científica e respetivas informações de cultivo[cite: 16]. [cite_start]Além da componente analítica, a plataforma incentiva a vertente social e a partilha de conhecimento através de um feed comunitário de descobertas e da criação de coleções digitais que funcionam como herbários pessoais privados[cite: 17].

[cite_start]Este projeto foi desenvolvido no âmbito da unidade curricular Computação em Nuvem da licenciatura em Engenharia Informática, na Escola Superior de Tecnologia do Instituto Politécnico de Castelo Branco[cite: 11, 52].

## ✨ Funcionalidades
* [cite_start]**Autenticação e Gestão de Perfil:** Sistema de registo e acesso seguro, com página de perfil personalizada que exibe as "Descobertas" do utilizador[cite: 169, 170, 172].
* [cite_start]**Identificação Botânica Inteligente:** Processamento na nuvem de imagens submetidas, retornando o nome comum, a identificação científica, uma breve descrição e a taxa de confiança da previsão da IA[cite: 175, 177, 179].
* [cite_start]**Feed Comunitário:** Uma página pública e filtrável onde são apresentadas as plantas recentemente identificadas pela comunidade da plataforma[cite: 181, 182, 184].
* [cite_start]**Coleções Digitais Pessoais:** Secção "Minhas Coleções" que serve como um herbário pessoal, guardando o histórico de todas as identificações bem-sucedidas[cite: 185, 187].

## 🛠️ Tecnologias e Infraestrutura
[cite_start]A infraestrutura tecnológica assenta numa arquitetura moderna e escalável na nuvem Microsoft Azure[cite: 18].
* [cite_start]**Front-end:** Desenvolvido em React[cite: 262].
* [cite_start]**Alojamento e CI/CD:** Azure App Service com integração direta ao GitHub para alojamento contínuo e implementação automática do código[cite: 194].
* [cite_start]**Inteligência Artificial:** Azure Cognitive Services atuando como o motor central para a análise das fotografias e identificação das plantas[cite: 202].
* [cite_start]**Processamento:** Azure Functions (Serverless) responsáveis pelo back-end automático de processamento de submissão de imagens[cite: 198].
* [cite_start]**Base de Dados:** Azure Cosmos DB for NoSQL para a persistência não relacional dos dados de utilizadores e do feed[cite: 199, 423].
* [cite_start]**Armazenamento:** Azure Blob Storage para guardar de forma segura e fiável as imagens submetidas[cite: 196].
* [cite_start]**Isolamento:** Docker Containers utilizados para isolar componentes específicos do sistema[cite: 201].
* [cite_start]**Automação:** Criação autónoma da infraestrutura baseada em scripts de PowerShell utilizando a Azure CLI[cite: 263, 429].

## 👥 Autores
* [cite_start]Catarina Antunes (nº 20170667) [cite: 6]
* [cite_start]Martim Martins (nº 20230327) [cite: 7]
* [cite_start]Tomás Santos (nº 20220896) [cite: 8]

## 📄 Licença
[cite_start]Este projeto encontra-se sob a licença MIT[cite: 354].
