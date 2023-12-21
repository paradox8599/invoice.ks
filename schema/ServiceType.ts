import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, relationship } from "@keystone-6/core/fields";

import type { Lists } from ".keystone/types";

export const ServiceType: Lists.ServiceType = list({
  access: allowAll,
  hooks: {
    async validateDelete({ item, context, operation, addValidationError }) {
      if (operation === "delete") {
        const refs = await context.query.Service.count({
          where: { type: { id: { equals: item.id } } },
        });
        refs > 0 &&
          addValidationError(
            "Cannot delete this type, it is still referenced by other services."
          );
      }
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text({ validation: { isRequired: true } }),
    services: relationship({
      ref: "Service.type",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
