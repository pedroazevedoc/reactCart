# React Cart

Loja virtual (e-commerce) desenvolvida em React + TypeScript, consumindo a API pública [DummyJSON](https://dummyjson.com/docs/products). O projeto simula um fluxo completo de compras: listagem de produtos com busca, ordenação e filtros, página de detalhes, carrinho e lista de favoritos.

## Tecnologias

### Stack principal

| Tecnologia | Versão | Uso no projeto |
| --- | --- | --- |
| [React](https://react.dev) | 19.3.0 | Biblioteca de UI (componentes funcionais e hooks) |
| [TypeScript](https://www.typescriptlang.org) | 6.0.3 | Tipagem estática do projeto |
| [Vite](https://vite.dev) | 8.3.4 | Build e servidor de desenvolvimento (HMR) |
| [React Router](https://reactrouter.com) | 7.18.4 | Roteamento SPA (`createBrowserRouter`) |
| [Tailwind CSS](https://tailwindcss.com) | 4.3.3 | Estilização utilitária (tema via `@theme`) |
| [Axios](https://axios-http.com) | 1.20.0 | Cliente HTTP para consumo da API |
| [React Icons](https://react-icons.github.io/react-icons) | 5.7.0 | Ícones (Feather, Font Awesome, Material, Tabler) |
| [React Hot Toast](https://react-hot-toast.com) | 2.6.1 | Notificações (toasts) de feedback |

### Ferramentas de desenvolvimento

| Tecnologia | Versão |
| --- | --- |
| [ESLint](https://eslint.org) | 10.10.0 |
| [typescript-eslint](https://typescript-eslint.io) | 8.69.0 |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | 6.1.1 |
| [@tailwindcss/vite](https://tailwindcss.com/docs/installation/using-vite) | 4.3.3 |

> **Node.js:** o projeto foi desenvolvido com Node **24.15.0** e npm **12.2.0**. Recomenda-se Node 20+.
>
> As versões acima refletem o ambiente de desenvolvimento. Os intervalos declarados no `package.json` (ex.: `^19.2.8`) podem resolver para versões de patch mais recentes ao instalar.

## Funcionalidades

### Listagem de produtos (`/`)
- **Infinite scroll** com `IntersectionObserver` nativo, carregando 10 produtos por vez (`limit`/`skip`).
- **Busca por nome** com debounce de 300ms, cancelamento de requisição via `AbortController` e o termo refletido na URL (`?q=`).
- **Ordenação** por menor preço, maior preço, melhor avaliação e maior desconto (`sortBy`/`order`), com a escolha refletida na URL (`?sort=price:asc`).
- **Filtro por categoria** em chips, carregado da API, com toggle (clicar na categoria ativa remove o filtro) e a seleção refletida na URL (`?category=smartphones`).
- Contador de resultados contextual e estado vazio que cita os filtros ativos.

### Detalhes do produto (`/products/:id`)
- Galeria de imagens com miniaturas clicáveis.
- Informações completas: preço com desconto aplicado, desconto (%), avaliação em estrelas, disponibilidade, estoque e pedido mínimo.
- Especificações técnicas (SKU, marca, categoria, peso, dimensões, datas de cadastro/atualização), QR Code e código de barras.
- Avaliações de clientes (nota, comentário, autor e data).
- Informações de entrega, garantia e política de devolução.
- Adição ao carrinho sem sair da página.

### Carrinho (`/cart`)
- Lista com imagem, marca, categoria, valor unitário e subtotal por item.
- Controle de quantidade (`+`/`-`) com o botão de incremento **desabilitado ao atingir o estoque** disponível.
- Remoção de item e resumo com quantidade total de unidades e valor total.
- Persistência em memória via Context API.

### Favoritos (`/favorites`)
- Lista enxuta com imagem, título, marca/categoria e preço com desconto.
- Data e horário em que o produto foi adicionado aos favoritos (pt-BR).
- Remoção individual e acesso direto à página do produto.

### Gerais
- Layout responsivo (mobile-first) em todas as telas.
- Página 404 para rotas não identificadas.
- Estados de carregamento e de vazio padronizados em todas as listagens.
- Feedback de ações via toast (adicionar/remover do carrinho e dos favoritos).

## Estrutura do projeto

```
src/
├── components/
│   ├── cards/ProductCard.tsx    # Card de produto (listagem)
│   ├── container/index.tsx      # Wrapper padrão das páginas (título + largura máxima)
│   ├── header/index.tsx         # Cabeçalho com navegação e contador do carrinho
│   ├── layout/index.tsx         # Layout base (Header + Outlet)
│   └── ui/badge.tsx             # Componente de badge (tags e status)
├── contexts/
│   ├── AppProviders.tsx         # Agrupa todos os providers da aplicação
│   ├── CartContext.tsx          # Estado do carrinho de compras
│   └── FavoriteContext.tsx      # Estado dos favoritos
├── pages/
│   ├── home/index.tsx           # Listagem, busca, ordenação, categorias e infinite scroll
│   ├── product/index.tsx        # Detalhes do produto
│   ├── cart/index.tsx           # Carrinho de compras
│   ├── favorites/index.tsx      # Favoritos
│   └── not-found/index.tsx      # Página 404
├── services/
│   ├── api.ts                   # Instância do Axios (baseURL apontando para o proxy /api)
│   └── products.ts              # Serviço de produtos (listagem, busca, categorias)
├── types/index.ts               # Tipos e interfaces compartilhados
├── App.tsx                      # Definição das rotas
├── index.css                    # Tailwind + paleta de cores (tema taupe)
└── main.tsx                     # Ponto de entrada da aplicação
```

## API

Os dados vêm da API pública **[DummyJSON](https://dummyjson.com/docs/products)** (194 produtos de exemplo, 24 categorias). As requisições são feitas para `/api/...` e o **proxy do Vite** (`vite.config.ts`) reescreve para `https://dummyjson.com`, evitando problemas de CORS em desenvolvimento.

Endpoints utilizados:

| Endpoint | Uso |
| --- | --- |
| `GET /products?limit=&skip=` | Listagem paginada (infinite scroll) |
| `GET /products/search?q=` | Busca por nome |
| `GET /products?sortBy=&order=` | Ordenação |
| `GET /products/categories` | Lista de categorias |
| `GET /products/category/:slug` | Produtos de uma categoria |
| `GET /products/:id` | Detalhes de um produto |

## Como instalar e rodar

### Pré-requisitos
- [Node.js](https://nodejs.org) 20 ou superior (desenvolvido com a versão 24)
- npm (ou yarn/pnpm, se preferir)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/pedroazevedoc/reactCart.git

# 2. Acesse a pasta do projeto
cd reactCart

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**.

> A API é pública e não requer autenticação, chave de acesso ou variáveis de ambiente.

### Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Verifica os tipos (`tsc -b`) e gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Executa o ESLint em todo o projeto |

### Build de produção

```bash
npm run build
npm run preview
```

## Padrões e decisões técnicas

- **Gerenciamento de estado com Context API**: `CartContext` e `FavoriteContext` centralizam os estados globais, agrupados pelo `AppProviders` para manter `main.tsx` limpo. Os dados vivem em memória (sem persistência).
- **Estado dos filtros na URL**: busca, ordenação e categoria usam `useSearchParams`, o que torna os resultados compartilháveis por link, sobrevive ao *refresh* e faz os botões de voltar/avançar do navegador funcionarem naturalmente.
- **Camada de serviço**: o acesso à API é isolado em `src/services`, mantendo os componentes livres de detalhes de requisição.
- **`AbortController`**: requisições obsoletas são canceladas ao trocar busca/ordenação/categoria, evitando que uma resposta lenta sobrescreva resultados mais recentes (*race condition*).
- **Paleta de cores própria**: o tema `taupe` é declarado via `@theme` no `index.css` (novo sistema de tema do Tailwind CSS v4).
- **Tipagem**: as entidades da API são descritas em `src/types/index.ts` e nos serviços, sem uso de `any`.

## Licença

Este projeto é de uso livre para fins de estudo e portfólio. Os dados são fornecidos publicamente pela [DummyJSON](https://dummyjson.com).
