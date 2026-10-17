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

## Executar localmente com Supabase

Requisitos: Node.js, npm e um projeto PostgreSQL no Supabase.

1. Copie `proxima-pagina-api/.env.example` para `proxima-pagina-api/.env` e substitua `[SUA-SENHA]` nos dois URLs pela senha do banco Supabase. Se a senha contiver caracteres reservados em URLs, aplique URL-encoding. O certificado CA em `proxima-pagina-api/certs/prod-ca-2021.crt` é usado para validar a identidade do servidor TLS; mantenha `sslmode=verify-full`.
2. Instale dependências e prepare o banco:

   ```sh
   cd proxima-pagina-api
   npm install
   npm run db:generate
   npx prisma migrate deploy
   npm run db:seed
   ```

3. Na raiz do projeto, inicie o frontend com `npm run dev` e a API com `npm run dev:api`.

`DATABASE_URL` usa o pooler de transações do Supabase para as requisições da API; `DIRECT_URL` usa o pooler de sessão para migrações. O Prisma 7 deste projeto configura a URL de migração em `prisma.config.ts` (a propriedade `directUrl` no `schema.prisma` pertence ao padrão anterior do Prisma e não é suportada aqui). Mantenha as URLs reais no `.env` ignorado pelo Git e nas variáveis privadas da hospedagem; disponibilize também o CA do Supabase no caminho referenciado por `sslrootcert`.

## Publicar a API Node.js na Hostinger

Na Aplicação Node.js do hPanel, selecione a pasta `proxima-pagina-api` como diretório da aplicação e configure:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | URL do pooler de transações do Supabase na porta `6543`, com `sslmode=require` e `sslrootcert=certs/prod-ca-2021.crt` |
| `DIRECT_URL` | URL do pooler de sessão do Supabase na porta `5432`, com `sslmode=require` e `sslrootcert=certs/prod-ca-2021.crt` |
| `PORT` | `3333` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://proximapagina.vitorcostadela.com` |
| `COOKIE_SECURE` | `true` |

Substitua a senha nos dois URLs do Supabase e aplique URL-encoding se ela contiver caracteres reservados. Não salve credenciais no Git. O certificado público do Supabase deve estar implantado em `proxima-pagina-api/certs/prod-ca-2021.crt`; `sslrootcert` permite validar o certificado TLS do banco.

Use `npm install` para instalar dependências, `npm run build` como comando de build e `npm start` como comando de inicialização. O TypeScript compila para `proxima-pagina-api/dist/`, e o entrypoint de produção é `dist/server.js`. O servidor escuta `process.env.PORT` (com padrão `3333`). A rota `GET /health` responde HTTP 200 com `{"status":"ok"}`.

Depois que a API estiver ativa, defina `VITE_API_URL` no ambiente de build do frontend com a URL HTTPS pública da aplicação Node da Hostinger, sem `/api` e sem barra final. Gere e publique novamente o frontend para que ele passe a chamar essa API.

## Regras do domínio

- O catálogo inicial é carregado de `proxima-pagina-api/src/data/catalogoInicial.ts`; as capas das 60 obras estão mapeadas em `proxima-pagina-api/src/data/capasCatalogo.ts` e são servidas pela Open Library Covers API.
- A biblioteca inicia vazia; filtros de categoria são derivados dos livros que o usuário adicionou a ela.
- As capas podem ser buscadas opcionalmente no Google Books por ISBN, título e autor. A URL selecionada é salva no campo `capaUrl`; se ela estiver ausente ou falhar, a interface mostra uma capa colorida com o título.
- A busca do Google Books usa `GOOGLE_BOOKS_API_KEY` opcional na configuração privada da API; se a cota pública estiver indisponível, a URL da capa pode ser informada manualmente.
- Livros do catálogo podem ser adicionados/removidos da biblioteca e ter status/avaliação alterados; seus dados não podem ser editados ou excluídos.
- Um livro cadastrado pelo usuário já entra na biblioteca e pode ser editado ou excluído. Ao excluí-lo, o item da biblioteca também é removido.
- A Home e o catálogo são públicos. Para acessar a biblioteca, salvar livros ou cadastrar livros próprios, é necessário criar uma conta ou entrar.
- Cada conta tem uma biblioteca isolada. Os livros do catálogo são compartilhados; livros pessoais e sessões são associados à conta. Senhas são armazenadas com hash e a sessão usa cookie `HttpOnly` com validade de sete dias. A senha deve ter pelo menos oito caracteres.
- O cookie de sessão inclui `Secure` por padrão. Para desenvolvimento local com HTTP, `COOKIE_SECURE=false` pode ser usado no `.env`; a API rejeita esse valor quando `NODE_ENV=production`. Em produção, sirva o site e a API exclusivamente por HTTPS.
- A API usa o PostgreSQL do Supabase: `DATABASE_URL` para o pooler de transações e `DIRECT_URL` para migrações do Prisma.
- A migração de autenticação remove os itens antigos da biblioteca e os livros pessoais que não tinham proprietário; o catálogo compartilhado é preservado.

## Rotas principais

| Método | Rota | Acesso | Ação |
|---|---|---|---|
| POST | `/api/auth/cadastro` | Público | Criar conta com nome, e-mail e senha |
| POST | `/api/auth/login` | Público | Iniciar sessão |
| GET | `/api/auth/me` | Público | Consultar a conta da sessão atual |
| POST | `/api/auth/logout` | Público | Encerrar sessão |
| GET | `/api/livros?busca=&categoria=` | Público | Buscar no catálogo e indicar os livros salvos pela conta atual |
| GET | `/api/livros/capas?isbn=&titulo=&autor=` | Público | Buscar sugestões de capas no Google Books |
| GET | `/api/livros/categorias` | Público | Listar categorias do catálogo |
| GET | `/api/livros/:id` | Público/Proprietário | Ver detalhes de um livro público ou próprio |
| POST | `/api/livros` | Conta | Cadastrar livro próprio e adicioná-lo à biblioteca |
| PATCH | `/api/livros/:id` | Proprietário | Editar dados de um livro próprio |
| DELETE | `/api/livros/:id` | Proprietário | Excluir um livro próprio |
| GET | `/api/biblioteca` | Conta | Listar a biblioteca da conta atual |
| POST | `/api/biblioteca` | Conta | Adicionar um livro do catálogo |
| PATCH | `/api/biblioteca/:livroId` | Conta | Alterar o status ou a avaliação da própria biblioteca |
| DELETE | `/api/biblioteca/:livroId` | Conta | Remover um livro do catálogo da própria biblioteca |

As entradas e respostas usam os campos em português definidos no modelo, como `titulo`, `autor`, `categoria`, `idioma`, `status` e `avaliacao`.
