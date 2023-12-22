import { Lists } from "../admin/helpers/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship } from "@keystone-6/core/fields";

import { createdAtField, updatedAtField } from "../admin/helpers/fields";

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
    businessNumberType: relationship({
      ref: "BusinessNumberType",
      hooks: {
        validateInput({ inputData, item, addValidationError }) {
          if (!inputData.businessNumberType?.connect?.id) {
            addValidationError("Business Number Type is required");
          }
        },
      },
    }),
    businessNumber: text({
      validation: { isRequired: true },
      isIndexed: "unique",
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

    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
