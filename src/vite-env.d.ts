/// <reference types="vite/client" />

declare namespace React {
  interface HTMLAttributes {
    // Preact supports using "class" instead of "classname" - need to teach typescript
    class?: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_SEARCH_URL: string;
  readonly VITE_NODE_SERVER: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
  readonly VITE_AUTH0_ADMIN_USER: string;
  readonly VITE_REDIRECT_TO_STRIPE: string;
  readonly VITE_STRIPE_PK_TEST: string;
  readonly VITE_PAYMENT_METHOD: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
