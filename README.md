# Próxima Página

Aplicação simples para explorar um catálogo de livros e organizar uma biblioteca pessoal. O projeto separa a interface React da API Express; os dados persistem em PostgreSQL usando Prisma.

## Estrutura

```text
src/
  components/       Componentes visuais reutilizáveis
  pages/            Telas e navegação do React
  services/api.ts   Comunicação HTTP com a API
  types/            Tipos compartilhados pelo frontend
proxima-pagina-api/
  prisma/           Modelo e migrações do banco
  src/
    config/         Variáveis de ambiente e cliente Prisma
    data/           Catálogo inicial para seed
    errors/         Erros HTTP da aplicação
    middlewares/    Tratamento centralizado de erros
    routes/         Rotas de livros e biblioteca
    schemas/        Validação dos dados recebidos
    scripts/        Seed do banco
```

## Executar localmente

Requisitos: Node.js, npm e Docker com Docker Compose (ou uma instância PostgreSQL própria).

1. Inicie o PostgreSQL local:

   ```sh
   docker compose up -d
   ```

2. Configure a API e crie o banco:

   ```sh
   cp proxima-pagina-api/.env.example proxima-pagina-api/.env
   cd proxima-pagina-api
   npm install
   npm run db:generate
   npm run db:migrate -- --name inicial
   npm run db:seed
   ```

   Se já tiver PostgreSQL, ajuste `DATABASE_URL` em `proxima-pagina-api/.env`.

3. Em um terminal, na raiz do projeto, inicie o frontend:

   ```sh
   npm install
   npm run dev
   ```

4. Em outro terminal, na raiz do projeto, inicie a API:

   ```sh
   npm run dev:api
   ```

   A API fica em `http://localhost:3333`; `GET /health` verifica se está ativa.

## Regras do domínio

- O catálogo inicial é carregado de `proxima-pagina-api/src/data/catalogoInicial.ts`; as capas das 60 obras estão mapeadas em `proxima-pagina-api/src/data/capasCatalogo.ts` e são servidas pela Open Library Covers API.
- A biblioteca inicia vazia; filtros de categoria são derivados dos livros que o usuário adicionou a ela.
- As capas podem ser buscadas opcionalmente no Google Books por ISBN, título e autor. A URL selecionada é salva no campo `capaUrl`; se ela estiver ausente ou falhar, a interface mostra uma capa colorida com o título.
- A busca do Google Books usa `GOOGLE_BOOKS_API_KEY` opcional na configuração privada da API; se a cota pública estiver indisponível, a URL da capa pode ser informada manualmente.
- Livros do catálogo podem ser adicionados/removidos da biblioteca e ter status/avaliação alterados; seus dados não podem ser editados ou excluídos.
- Um livro cadastrado pelo usuário já entra na biblioteca e pode ser editado ou excluído. Ao excluí-lo, o item da biblioteca também é removido.
- Esta versão é de usuário único e ainda não implementa autenticação. A tabela da biblioteca representa a coleção local da aplicação, não coleções isoladas por conta.

## Rotas principais

| Método | Rota | Ação |
|---|---|---|
| GET | `/api/livros?busca=&categoria=` | Buscar no catálogo |
| GET | `/api/livros/capas?isbn=&titulo=&autor=` | Buscar sugestões de capas no Google Books |
| GET | `/api/livros/categorias` | Listar categorias do catálogo |
| GET | `/api/livros/:id` | Ver detalhes de um livro |
| POST | `/api/livros` | Cadastrar livro próprio e adicioná-lo à biblioteca |
| PATCH | `/api/livros/:id` | Editar dados de um livro próprio |
| DELETE | `/api/livros/:id` | Excluir um livro próprio |
| GET | `/api/biblioteca` | Listar a biblioteca |
| POST | `/api/biblioteca` | Adicionar um livro do catálogo |
| PATCH | `/api/biblioteca/:livroId` | Alterar status ou avaliação |
| DELETE | `/api/biblioteca/:livroId` | Remover um livro do catálogo da biblioteca |

As entradas e respostas usam os campos em português definidos no modelo, como `titulo`, `autor`, `categoria`, `idioma`, `status` e `avaliacao`.
