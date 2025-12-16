# Guia de Deploy e Testes - NãoAssine

Este guia explica como configurar o ambiente de desenvolvimento, testar os pagamentos localmente e fazer o deploy do projeto no Vercel.

## 1. Pré-requisitos

Certifique-se de ter instalado:
- **Node.js**: v18+
- **Vercel CLI**: `npm i -g vercel`
- **Stripe CLI**: [Instalar Stripe CLI](https://stripe.com/docs/stripe-cli)

## 2. Configuração Local (Variáveis de Ambiente)

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves (copie do `.env.local` se houver):

```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_SERVICE_ROLE=sua_key_service_role
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (obtido no passo 3)
VITE_STRIPE_PRICE_ID=price_...
API_KEY=sua_chave_gemini
```

## 3. Testando Webhooks do Stripe Localmente

Como o Vite (frontend) não roda funções de backend nativamente, usaremos o Vercel CLI ou o Stripe CLI para testar.

### Opção A: Usando Vercel CLI (Recomendado)

O `vercel dev` simula o ambiente da nuvem, rodando frontend e API juntos.

1.  Rode o servidor:
    ```bash
    vercel dev
    ```
2.  Em outro terminal, inicie o Stripe Listen apontando para a porta do Vercel (geralmente 3000):
    ```bash
    stripe listen --forward-to localhost:3000/api/webhook
    ```
3.  O Stripe CLI vai te dar um `Here is your webhook signing secret: whsec_...`. Copie esse valor para o seu `.env` na chave `STRIPE_WEBHOOK_SECRET`.
4.  Dispare um evento de teste:
    ```bash
    stripe trigger checkout.session.completed
    ```
5.  Verifique no terminal do Vercel se houve log de sucesso e no Supabase se a assinatura foi criada.

## 4. Deploy no Vercel

1.  Faça login no Vercel:
    ```bash
    vercel login
    ```
2.  Faça o deploy:
    ```bash
    vercel
    ```
3.  Configure as variáveis de ambiente no painel do Vercel (Project Settings > Environment Variables). **IMPORTANTE**: Adicione todas as variáveis do `.env` lá.

## 5. Configurando Webhook de Produção

1.  No Dashboard do Stripe (Developers > Webhooks), adicione um endpoint.
2.  URL: `https://seu-projeto.vercel.app/api/webhook`
3.  Eventos para ouvir:
    - `checkout.session.completed`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`

Tudo pronto! Seu SaaS está configurado para receber pagamentos e atualizações de assinatura.
