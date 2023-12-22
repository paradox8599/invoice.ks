import { Lists } from "../admin/helpers/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  relationship,
  timestamp,
  calendarDay,
} from "@keystone-6/core/fields";

import { importServices, validateClient } from "../admin/helpers/hooks";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";

export const Contract: Lists.Contract = list({
  access: allowAll,
  hooks: {
    async afterOperation({ context, inputData, item, operation }) {
      if (operation === "create") {
        // import services from existing quote
        await importServices({
          context,
          fromCollection: "Quote",
          toCollection: "Contract",
          fromId: inputData.quote?.connect?.id ?? void 0,
          toId: item.id,
        });
      }
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    client: relationship({
      ref: "Client.contracts",
      hooks: { validateInput: validateClient },
      ui: {
        createView: { fieldMode: "edit" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    quote: relationship({
      label: "From Quote",
      ref: "Quote",
      ui: {
        createView: { fieldMode: "edit" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    services: relationship({ ref: "Service.contracts", many: true }),
    sentAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    signedAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    displayDate: calendarDay({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
      },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
