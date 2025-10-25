## Descrição do Sistema

O projeto consiste em um **painel administrativo** para gerenciamento de clientes, composto por duas aplicações — **Frontend (React + Vite)** e **Backend (NestJS + TypeORM + PostgreSQL)** — com containerização via Docker e orquestração pelo Docker Compose.

### Fluxo principal do sistema
1. **Tela inicial:** o usuário insere seu nome.  
2. **Tela de clientes:** lista todos os clientes cadastrados, permitindo **CRUD** completo: criar, visualizar, atualizar e excluir.  
3. **Tela de detalhes:** mostra informações do cliente selecionado.

---

## Tecnologias utilizadas

### **Frontend**
- React + Vite + TypeScript  
- React Router DOM (navegação SPA)  
- Axios / Fetch API  
- TailwindCSS (opcional para estilização)  
- Testes end-to-end (diferencial) com **Playwright**  
- Dockerfile para execução isolada  

### **Backend**
- NestJS (Node.js + TypeScript)  
- TypeORM + PostgreSQL  
- Swagger para documentação  
- Jest para testes unitários  
- BullMQ / RabbitMQ (mensageria — diferencial)  
- Observabilidade via logs estruturados (Winston) e integração AWS CloudWatch  

### **Infraestrutura**
- Docker e Docker Compose  
- Arquitetura:
  - **ECS ou EKS** para deploy das aplicações
  - **RDS (PostgreSQL)** para banco de dados
  - **S3 + CloudFront** para servir o frontend
  - **SQS / SNS** para mensageria
  - **CloudWatch** para logs e métricas
  - **Secrets Manager** para variáveis sensíveis

---

---

## Estrutura do projeto

```
/
├── backend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── modules/clients/
│   │       ├── clients.controller.ts
│   │       ├── clients.service.ts
│   │       ├── clients.module.ts
│   │       ├── dto/
│   │       │   ├── create-client.dto.ts
│   │       │   └── update-client.dto.ts
│   │       └── entities/client.entity.ts
│   ├── test/
│   ├── Dockerfile
│   └── ormconfig.ts
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Clients.tsx
│   │   └── components/
│   │       └── ClientForm.tsx
│   ├── index.html
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---
---

###  **Quanto tempo levaria?**

| Etapa | Descrição | Tempo estimado |
|-------|------------|----------------|
| Planejamento e setup (repositório, Docker, CI/CD) | Configuração inicial e ambiente | 1–2 dias |
| Backend (NestJS + TypeORM + Swagger + testes) | API completa CRUD de clientes | 2–3 dias |
| Frontend (React + Vite + CRUD + navegação) | Telas e integração com API | 2–3 dias |
| Integração, QA | Validação final e refinamentos | 1–2 dias |

**➡️ Total: 5 a 10 dias úteis (2 a 3 semanas de calendário)**  

---

### **Quantos desenvolvedores?**

- **2 desenvolvedores** para MVP funcional:
  - 1 Backend (NestJS, banco, testes)
  - 1 Frontend (React, UX, integração)
- **3 desenvolvedores** para versão completa:
  - 1 Tech Lead / Full-stack
  - 1 Backend
  - 1 Frontend + QA

---

### **Qual a senioridade dos desenvolvedores?**

| Função | Responsabilidade | Senioridade |
|--------|------------------|--------------|
| **Tech Lead / Full-stack** | Arquitetura, DevOps, CI/CD, AWS | **Sênior** |
| **Backend Dev** | API, banco, testes, mensageria | **Pleno** |
| **Frontend Dev** | React, UX, integração, testes E2E | **Pleno** |

> Caso extremo um único **sênior full-stack** é capaz de entregar o MVP completo em ~3–4 semanas, caso seja necessário.

--- 

## Arquitetura

```
                ┌─────────────────────────────┐
                │        CloudFront (CDN)     │
                │         + S3 (Frontend)     │
                └──────────────┬──────────────┘
                               │
                     ┌─────────▼─────────┐
                     │   ECS / EKS (API) │
                     │   + NestJS        │
                     └─────────┬─────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │          RDS (PostgreSQL)           │
            │      + RabbitMQ / SQS / SNS         │
            └─────────────────────────────────────┘
```

---
