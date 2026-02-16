# Projeto de Backend - Sistema de Registro de Problemas

Avaliação Parcial - 
Plataforma de Registro de Problemas Institucionais


## O que eu usei no projeto:
- Node.js e TypeScript
- Express
- TypeORM 
- SQLite
- UUID

## Como rodar o projeto no seu PC:

1. Instalar tudo que precisa:
```bash
npm install
```

```bash
npm run migration:run
```

```bash
npm run start
```

## Categorias
- POST /categories – criar categoria
- GET /categories – listar categorias (com opção de filtrar ativas)
- GET /categories/:id – consultar categoria
- PUT /categories/:id – atualizar categoria
- DELETE /categories/:id – remover categoria (ou desativar)

Exemplos:

{
  "name": "Infraestrutura"
}

===============================================================
## Denúncias
- POST /reports – criar denúncia
- GET /reports – listar denúncias (com filtros e paginação)
- GET /reports/:id – consultar denúncia
- PATCH /reports/:id/status – alterar status da denúncia
- POST /reports/:id/updates – registrar atualização no histórico

Exemplos:

{
  "title": "Ar condicionado quebrado",
  "description": "O ar da sala 10 não está gelando",
  "categoryId": "coloque-o-id-aqui",
  "location": "Sala 10 - Bloco A",
  "priority": "ALTA",
  "reporterName": "Abimael Uanderson"
}

{
  "newStatus": "RESOLVIDA",
  "responsible": "Manutenção"
}

