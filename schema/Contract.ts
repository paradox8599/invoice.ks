import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  relationship,
  timestamp,
  calendarDay,
} from "@keystone-6/core/fields";

import type { Lists } from ".keystone/types";

import { validateClient } from "../admin/helpers/validation";

export const Contract: Lists.Contract = list({
  access: allowAll,
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
  },
});
