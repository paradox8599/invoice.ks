import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, timestamp, relationship } from "@keystone-6/core/fields";

import type { Lists } from ".keystone/types";

export const Client: Lists.Client = list({
  access: allowAll,
  fields: {
    name: text({
      ui: { description: "Business name" },
      validation: { isRequired: true },
    }),
    alias: text({}),
    email: text({
      validation: { isRequired: true },
    }),
    phone: text({
      validation: { isRequired: true },
    }),
    firstName: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    lastName: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    middleName: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    businessNumberType: text({
      defaultValue: "ABN",
      validation: { isRequired: true },
    }),
    businessNumber: text({
      validation: { isRequired: true },
      isIndexed: "unique",
    }),
    createdAt: timestamp({
      defaultValue: { kind: "now" },
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    updatedAt: timestamp({
      defaultValue: { kind: "now" },
      db: { updatedAt: true },
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),

    quotes: relationship({
      ref: "Quote.client",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    contracts: relationship({
      ref: "Contract.client",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    invoices: relationship({
      ref: "Invoice.client",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
