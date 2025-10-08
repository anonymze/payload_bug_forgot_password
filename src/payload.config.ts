import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { openapi, swaggerUI } from "payload-oapi";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Admins } from "./collections/admins";
import { AppUsers } from "./collections/app-users";

import { customTranslations } from "./utils/custom-translations";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  upload: {
    responseOnLimit: "Fichier trop lourd. Maximum autorisé 50 Mo.",
    abortOnLimit: true,
    limits: {
      fileSize: 50000000, // 50MB, written in bytes
    },
  },
  serverURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_SERVER_URL,
  cors: ["*"],
  localization: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
  },
  admin: {
    avatar: {
      Component: "/components/settings.tsx",
    },
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      logout: {
        Button: "/components/logout.tsx",
      },
      graphics: {
        Logo: "/components/logo.tsx",
        Icon: "/components/logo.tsx",
      },
    },

    meta: {
      title: "Simply Life Administration",
      description: "Administration pour l'application mobile Simply Life",
      icons: [
        {
          rel: "icon",
          type: "image/png",
          url: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          type: "image/png",
          url: "/favicon.ico",
        },
      ],
    },
  },
  // binded routes from dashboard and api
  routes: {
    admin: "/admin",
    api: "/api",
  },
  i18n: customTranslations,
  collections: [Admins, AppUsers],
  // globals: [CommissionImports],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    idType: "uuid",
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  email: resendAdapter({
    defaultFromAddress:
      process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    apiKey: process.env.RESEND_API_KEY || "",
    defaultFromName: "Simply Life Admin",
  }),
  plugins: [
    openapi({
      openapiVersion: "3.0",
      metadata: { title: "SIMPLY LIFE API", version: "1.0.0" },
    }),
    swaggerUI({}),
  ],
});
