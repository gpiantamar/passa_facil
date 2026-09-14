# PassaFácil API — Backend REST

API REST em **Node.js** com **Express** e **Prisma ORM**, modelada para um sistema de passadoria de roupas, configurada com banco de dados **PostgreSQL** (compatível com Supabase e Neon) e preparada para deploy na **Vercel** ou **Render**.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v18+) com ES Modules (`"type": "module"`)
- **Express** (Framework web leve e performático)
- **Prisma ORM** (Modelagem de dados, migrations e type-safe client)
- **PostgreSQL** (Supabase, Neon, Render ou Railway)
- **CORS** (Habilitado para consumo irrestrito pelo front-end)
- **Nodemon** (Hot reload no desenvolvimento)

---

## 📋 Modelagem no Prisma (`schema.prisma`)

1. **Cliente**: `id`, `nome`, `telefone`, `endereco`, `createdAt`, relação com `Pedido`.
2. **Servico**: `id`, `nome` (ex: Camisa Social, Lençol, Calça), `preco` (Float), `unidade` ("un" ou "kg"), relação com `ItemPedido`.
3. **Pedido**: `id`, `clienteId`, `status` ("recebido", "passando", "pronto", "entregue"), `valorTotal` (Float), `observacoes`, `previsaoPara`, `createdAt`, relação com `ItemPedido` e `Cliente`.
4. **ItemPedido**: `id`, `pedidoId`, `servicoId`, `quantidade` (Int), `valorUnit` (Float), deleção em cascata com `Pedido` (`onDelete: Cascade`) e relação com `Servico`.

---

## 🚀 Como Executar Localmente

### 1. Entrar na pasta do backend e instalar as dependências
```bash
cd server
npm install
```

### 2. Configurar as variáveis de ambiente
Crie o arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```
Edite a variável `DATABASE_URL` no `.env` com a URL do seu PostgreSQL (Supabase/Neon):
```env
PORT=3000
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.SEU_PROJETO.supabase.co:5432/postgres?schema=public&sslmode=require"
```

### 3. Rodar as migrações do banco
```bash
npx prisma migrate dev --name init
```

### 4. Iniciar o servidor em desenvolvimento
```bash
npm run dev
```
O servidor estará acessível em `http://localhost:3000`.

---

## 📡 Endpoints da API

### **Clientes**
- `GET /clientes` — Lista todos os clientes cadastrados (ordenados por criação decrescente).
- `POST /clientes` — Cadastra um novo cliente.
  ```json
  {
    "nome": "Maria Oliveira",
    "telefone": "(14) 99999-8888",
    "endereco": "Rua das Flores, 123"
  }
  ```

### **Serviços**
- `GET /servicos` — Lista todos os serviços e preços (ordenados alfabeticamente).
- `POST /servicos` — Cadastra um novo tipo de serviço.
  ```json
  {
    "nome": "Camisa Social",
    "preco": 12.50,
    "unidade": "un"
  }
  ```

### **Pedidos**
- `GET /pedidos` — Lista pedidos em ordem decrescente de data com `cliente`, `itens` e `servico` associado.
- `POST /pedidos` — Cria pedido calculando automaticamente o `valorTotal` a partir dos itens.
  ```json
  {
    "clienteId": "ID_DO_CLIENTE",
    "observacoes": "Passar com vinco duplo",
    "previsaoPara": "2026-09-15T18:00:00Z",
    "status": "recebido",
    "itens": [
      {
        "servicoId": "ID_DO_SERVICO_CAMISA",
        "quantidade": 3,
        "valorUnit": 12.50
      },
      {
        "servicoId": "ID_DO_SERVICO_LENCOL",
        "quantidade": 2
      }
    ]
  }
  ```
  *(Se `valorUnit` for omitido, a API busca automaticamente o preço atual cadastrado no serviço).*

- `PATCH /pedidos/:id/status` — Atualiza o status do pedido.
  Status válidos: `"recebido"`, `"passando"`, `"pronto"`, `"entregue"`.
  ```json
  {
    "status": "passando"
  }
  ```

---

## ☁️ Deploy

### Deploy na Vercel (Serverless)
O repositório já inclui o arquivo `vercel.json` configurado:
1. Conecte o repositório na **Vercel**.
2. Defina o **Root Directory** como `server`.
3. Adicione a variável de ambiente `DATABASE_URL` nas configurações do projeto na Vercel.
4. O build command executará automaticamente `npm run build` (`prisma generate`).

### Deploy no Render (Web Service)
1. Crie um novo **Web Service** no Render apontando para o seu repositório.
2. Defina o **Root Directory** como `server`.
3. Defina os comandos:
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
4. Em **Environment Variables**, adicione `DATABASE_URL` do seu banco Supabase/Neon e `PORT=3000`.
