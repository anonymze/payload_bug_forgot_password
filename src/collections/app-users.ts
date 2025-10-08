import { type CollectionConfig } from "payload";

export const AppUsers: CollectionConfig = {
  slug: "app-users",
  access: {
    read: ({ req }) => true,
    create: ({ req }) => true,
    update: ({ req }) => true,
    delete: ({ req }) => true,
  },
  auth: {
    maxLoginAttempts: 4,
    tokenExpiration: 60 * 60 * 24 * 60, // 60 days
    forgotPassword: {
      expiration: 60 * 60 * 24 * 3, // 3 days
    },
  },
  labels: {
    singular: {
      en: "App users",
      fr: "App users",
    },
    plural: {
      en: "App users",
      fr: "App users",
    },
  },

  fields: [
    {
      name: "lastname",
      type: "text",
      required: true,
      label: {
        en: "Lastname",
        fr: "Nom",
      },
    },
  ],
};
