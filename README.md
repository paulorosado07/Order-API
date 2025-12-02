# 🚀 Order API – Sistema de Gestão de Pedidos (Node.js + TypeScript)

API RESTful desenvolvida para gerenciamento de pedidos, seguindo boas práticas de arquitetura, validação, versionamento de API e organização de camadas.  
Este projeto foi construído em **Node.js + Express + TypeScript**, validado com **Zod**, persistido com **SQLite + Prisma**, totalmente documentado via **Swagger**, e conta com testes automatizados utilizando **Jest**.

---

## 📌 Funcionalidades

A API permite:

- Criar pedidos  
- Buscar um pedido específico  
- Listar pedidos  
- Atualizar pedidos (PUT)  
- Excluir pedidos  
- Validação completa do payload  
- Regras de consistência: soma dos itens deve bater com valorTotal  
- Estrutura de respostas padronizada  
- Suporte a HATEOAS
- Documentação via Swagger em `/docs`  

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express.js**
- **Prisma ORM**
- **SQLite**
- **Zod** (validação de entrada)
- **Swagger UI Express**
- **Jest + Supertest** (testes)
- **ESLint** (padrões de código)

---

## 📂 Estrutura do Projeto

```
.
├── app.ts
├── config
│   ├── database.ts
│   └── swagger.ts
├── middleware
│   └── errorHandler.ts
├── models
│   └── order.model.ts
├── repositories
│   └── order.repository.ts
├── routers
│   └── order.router.ts
├── schemas
│   └── order.schema.ts
├── server.ts
└── services
    └── order.service.ts
````

---

## ▶️ Como rodar o projeto

### 🔧 **1. Pré-requisitos**
- Node.js 20+
- NPM 9+
- (opcional) Docker instalado
- Git instalado

---

## 🖥️ Rodar no **Linux**

```bash
git clone <URL_DO_SEU_REPO>
cd project-root

npm install

npx prisma migrate dev --name init
npx prisma generate

npm run dev
````

API rodando em:

```
http://localhost:3000
```

Swagger:

```
http://localhost:3000/docs
```

---

## 🪟 Rodar no **Windows**

Abra o **PowerShell** e execute:

```powershell
git clone <URL_DO_SEU_REPO>
cd project-root

npm install

npx prisma migrate dev --name init
npx prisma generate

npm run dev
```

---

# 📡 Endpoints da API

Base URL:

```
http://localhost:3000/order
```

---

## ➕ Criar pedido (POST)

**POST** `/order`

### Exemplo de Body:

```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

Retorno:

```json
{
  "data": {
    "orderId": "v10089015vdb-01",
    "links": [
      {
        "rel": "self",
        "href": "http://localhost:3000/order/v10089015vdb-01",
        "method": "GET"
      }
    ]
  },
  "errors": [],
  "meta": {}
}
```

---

## 🔍 Buscar pedido

**GET** `/order/{orderId}`

---

## 📃 Listar todos os pedidos

**GET** `/order/list/all`

* Não retorna itens, apenas pedidos
* Cada pedido possui link HATEOAS para consulta individual

---

## ✏️ Atualizar pedido (PUT)

**PUT** `/order/{orderId}`

### Body aceito:

```json
{
  "valorTotal": 20000,
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 10000
    }
  ]
}
```

`numeroPedido` e `dataCriacao` **não são enviados**, conforme regra de negócio.

---

## ❌ Excluir pedido

**DELETE** `/order/{orderId}`
→ Deleta o pedido e todos os itens associados.

---

## 📄 Documentação Swagger

Acesse:

```
http://localhost:3000/docs
```

---

## 🧪 Testes Automatizados

Rodar todos os testes:

```bash
npm test
```

Rodar testes com cobertura:

```bash
npm run test:coverage
```

Arquivo de testes localizado em:

```
tests/order.service.test.ts
```

---

## 🧑‍💻 Commits sugeridos para subir no GitHub

Aqui vão 4 commits limpos, bem descritos (padrão profissional):

### **1️⃣ Inicialização do projeto**

```
feat: inicializa projeto Node.js + TypeScript com estrutura base
```

### **2️⃣ Implementação da API de pedidos**

```
feat: implementa CRUD completo de pedidos com Prisma, validação e regras de negócio
```

### **3️⃣ Documentação da API**

```
docs: adiciona documentação Swagger e cria README detalhado
```

### **4️⃣ Testes automatizados**

```
test: adiciona testes unitários e de integração garantindo cobertura mínima de 80%
```

---

Se você quiser, posso:

✅ Gerar uma versão ainda mais “bonita” do README
✅ Criar um banner ASCII para o topo
✅ Gerar os comandos git completos (init, branch, push)
✅ Gerar badges (Coverage, Node version, License, etc.)

Só pedir!
