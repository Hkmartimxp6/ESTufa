# ESTufa 🌿

**ESTufa** é uma aplicação web baseada na plataforma Microsoft Azure, dedicada à identificação de espécies botânicas com recurso à inteligência artificial. Desenvolvida para ser uma ferramenta indispensável no cuidado e conhecimento da biodiversidade botânica.

<img width="922" height="593" alt="image" src="https://github.com/user-attachments/assets/973afdf8-c1b8-44ff-8d33-7c85c89a42b3" />

## 📖 Sobre o Projeto
A ferramenta permite aos utilizadores submeter fotografias de plantas para obter, de forma imediata, a sua identificação científica e respetivas informações de cultivo. Além da componente analítica, a plataforma incentiva a vertente social e a partilha de conhecimento através de um feed comunitário de descobertas e da criação de coleções digitais que funcionam como herbários pessoais privados.

Este projeto foi desenvolvido no âmbito da unidade curricular Computação em Nuvem da licenciatura em Engenharia Informática, na Escola Superior de Tecnologia do Instituto Politécnico de Castelo Branco.

## ✨ Funcionalidades
* **Autenticação e Gestão de Perfil:** Sistema de registo e acesso seguro, com página de perfil personalizada que exibe as "Descobertas" do utilizador.
* **Identificação Botânica Inteligente:** Processamento na nuvem de imagens submetidas, retornando o nome comum, a identificação científica, uma breve descrição e a taxa de confiança da previsão da IA.
* **Feed Comunitário:** Uma página pública e filtrável onde são apresentadas as plantas recentemente identificadas pela comunidade da plataforma.
* **Coleções Digitais Pessoais:** Secção "Minhas Coleções" que serve como um herbário pessoal, guardando o histórico de todas as identificações bem-sucedidas.

<img width="910" height="587" alt="image" src="https://github.com/user-attachments/assets/2348e0b7-ea8c-4d70-89b3-d34d3efdb62b" />

<img width="831" height="532" alt="image" src="https://github.com/user-attachments/assets/847445a8-092a-4767-a44e-880c33a18739" />

<img width="831" height="532" alt="image" src="https://github.com/user-attachments/assets/357fa666-9618-433b-9057-1f69bf3c940b" />

## 🛠️ Tecnologias e Infraestrutura
A infraestrutura tecnológica assenta numa arquitetura moderna e escalável na nuvem Microsoft Azure.
* **Front-end:** Desenvolvido em React.
* **Alojamento e CI/CD:** Azure App Service com integração direta ao GitHub para alojamento contínuo e implementação automática do código.
* **Inteligência Artificial:** Azure Cognitive Services atuando como o motor central para a análise das fotografias e identificação das plantas.
* **Processamento:** Azure Functions (Serverless) responsáveis pelo back-end automático de processamento de submissão de imagens.
* **Base de Dados:** Azure Cosmos DB for NoSQL para a persistência não relacional dos dados de utilizadores e do feed.
* **Armazenamento:** Azure Blob Storage para guardar de forma segura e fiável as imagens submetidas.
* **Isolamento:** Docker Containers utilizados para isolar componentes específicos do sistema.
* **Automação:** Criação autónoma da infraestrutura baseada em scripts de PowerShell utilizando a Azure CLI.

## 👥 Autores
* Catarina Antunes (nº 20170667)
* Martim Martins (nº 20230327)
* Tomás Santos (nº 20220896)

## 📄 Licença
Este projeto encontra-se sob a licença MIT.
