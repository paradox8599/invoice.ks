import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  text,
  timestamp,
  calendarDay,
  relationship,
} from "@keystone-6/core/fields";

import type { Lists } from ".keystone/types";

import { validateClient } from "../admin/helpers/validation";

export const Invoice: Lists.Invoice = list({
  access: allowAll,
  fields: {
    name: text({ validation: { isRequired: true } }),
    sentAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    paidAt: timestamp({ ui: { createView: { fieldMode: "hidden" } } }),
    displayDate: calendarDay({ ui: { createView: { fieldMode: "hidden" } } }),

    client: relationship({
      ref: "Client.invoices",
      hooks: { validateInput: validateClient },
    }),
    services: relationship({ ref: "Service.invoices", many: true }),
  },
});
