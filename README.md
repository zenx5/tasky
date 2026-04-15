# Tasky
Este projeto é uma aplicação de gerenciamento de tarefas (To-Do List). A solução foca em uma experiência de usuário fluida, com suporte completo para uso offline e sincronização inteligente.

### 🛠️ Stack Tecnológica
#### Backend (API)
 - **Linguagem:** C# (.NET 10.0)
 - **Banco de Dados:** SQLite (pela portabilidade e simplicidade na avaliação)
 - **ORM:** Entity Framework Core
 - **Documentação:** Swagger/OpenAPI
#### Frontend
 - **Framework:** React 18 com TypeScript
 - **Estilização:** Tailwind CSS & Radix UI
 - **Banco Local:** Dexie.js (IndexedDB) para suporte offline-first
 - **Internacionalização (i18n):** Suporte para Português (PT), Inglês (EN) e Espanhol (ES)

 ### 📋 Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
 - **.NET SDK 10.0**
 - **Node.js** (v18 ou superior)
 - **npm** ou **yarn**

### 🚀 Como Executar o Projeto
**1. Configuração do Backend (API)**
 1. Entre na pasta da API:
    ```
      cd TodoListApi
    ```
 2. Restaure as dependências:
    ```
      dotnet restore
    ```
 3. Execute as migrações para criar o banco de dados local (todo.db):
    ```
      dotnet ef database update
    ```
 4. Inicie o servidor:
    ```
      dotnet run
    ```

 A API estará disponível por padrão em `https://localhost:5170/api`. Você pode acessar a interface do Swagger para testes em `https://localhost:5170/swagger`.

**2. Configuração do Frontend**
 1. Entre na pasta do projeto web:
    ```
      cd TodoListReact
    ```
 2. Instale as dependências:
    ```
      npm install
    ```
 3. Inicie a aplicação:
    ```
      npm run dev
    ```
 4. Acesse no navegador: `http://localhost:5173`

### 💡 Diferenciais Implementados
 1. **Offline-First:** A aplicação funciona sem conexão à internet. As tarefas são salvas localmente via IndexedDB e sincronizadas automaticamente quando a conexão é restabelecida. (para testar o uso `npm run build && npm run preview`
 2. **Sincronização Inteligente:** Utilização de ExternalId (UUID) e carimbos de data/hora (UpdatedAt) no backend para garantir a integridade dos dados durante a sincronização de múltiplos dispositivos.
 3. **Internacionalização:** Interface totalmente traduzida (Português, espanhol e inglês).
 4. **Design Responsivo:** Interface adaptada para desktop e dispositivos móveis com componentes modernos e acessíveis.
