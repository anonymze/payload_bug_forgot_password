import { CollectionConfig } from "payload";

export const Admins: CollectionConfig = {
  slug: "admins",
  access: {
    read: ({ req }) => true,
    create: ({ req }) => true,
    update: ({ req }) => true,
    delete: ({ req }) => true,
  },
  labels: {
    singular: {
      en: "Admin",
      fr: "Administrateur",
    },
    plural: {
      en: "Admins",
      fr: "Administrateurs",
    },
  },
  admin: {
    group: {
      en: "Users",
      fr: "Utilisateurs",
    },
    // defaultColumns: ["name", "range", "price", "priceType", "threshold"],
    useAsTitle: "email",
  },
  auth: {
    useAPIKey: true,
    maxLoginAttempts: 4,
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
  },
  fields: [
    {
      name: "fullname",
      type: "text",
      required: true,
      label: {
        en: "Full name",
        fr: "Nom complet",
      },
    },
  ],
};
