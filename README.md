# 🚀 Life OS - Central de Produtividade Pessoal

O **Life OS** é uma aplicação web Full-Stack projetada para centralizar a gestão de tarefas, o acompanhamento de hábitos e a visualização de prioridades diárias em um único dashboard interativo. 

O projeto foi construído com foco em alta performance, código limpo e arquitetura modular, combinando uma API robusta em **Spring Boot** com um front-end moderno em **React** com suporte a múltiplos temas (Dark/Light).

---

## 🎯 Principais Funcionalidades

- **Cockpit Diário:** Painel de controle centralizado mostrando as prioridades do dia e a lista de hábitos ativos.
- **Gestão de Tarefas (CRUD):** Criação, edição, exclusão e categorização de tarefas por nível de prioridade (Alta, Média, Baixa) e data de vencimento.
- **Rastreador de Hábitos:** Check-in diário de hábitos com contador de constância (*streaks*).
- **Personalização de Interface:** Suporte nativo a **Dark Mode** (Preto e Verde-Esmeralda) e **Light Mode** (Branco e Dourado).
- **Autenticação e Segurança:** Proteção de rotas e isolamento de dados por usuário.

---

## 🛠️ Tecnologias Utilizadas

### **Back-end**
- **Java 17 / Spring Boot** (Spring Data JPA, Spring Security)
- **PostgreSQL** (Banco de dados relacional)
- **Docker & Docker Compose** (Ambiente de banco de dados isolado)

### **Front-end**
- **React** (Vite, Tailwind CSS, Lucide Icons)
- **Framer Motion** (Transições e animações sutis de UI)

---

## 📁 Estrutura do Repositório

O projeto utiliza uma estrutura no formato **Monorepo**:

```text
life-os/
├── backend/            # Aplicação Spring Boot e infraestrutura do banco
│   ├── src/
│   ├── pom.xml
│   └── docker-compose.yml
├── frontend/           # Aplicação React e componentes de interface
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
