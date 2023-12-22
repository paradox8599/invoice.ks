import { Lists } from "../admin/helpers/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  timestamp,
  calendarDay,
  relationship,
} from "@keystone-6/core/fields";

import { importServices, validateClient } from "../admin/helpers/hooks";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";

export const Invoice: Lists.Invoice = list({
  access: allowAll,
  hooks: {
    async afterOperation({ context, inputData, item, operation }) {
      if (operation === "create") {
        // import services from existing contract
        await importServices({
          context,
          fromCollection: "Contract",
          toCollection: "Invoice",
          fromId: inputData.contract?.connect?.id ?? void 0,
          toId: item.id,
        });
      }
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    client: relationship({
      ref: "Client.invoices",
      hooks: { validateInput: validateClient },
    }),
    contract: relationship({
      label: "From Contract",
      ref: "Contract",
      ui: {
        createView: { fieldMode: "edit" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    sentAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    paidAt: timestamp({ ui: { createView: { fieldMode: "hidden" } } }),
    displayDate: calendarDay({ ui: { createView: { fieldMode: "hidden" } } }),

    services: relationship({ ref: "Service.invoices", many: true }),

    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
