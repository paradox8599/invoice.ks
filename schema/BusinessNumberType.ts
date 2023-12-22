import { Lists } from "../admin/helpers/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";

export const BusinessNumberType: Lists.BusinessNumberType = list({
  access: allowAll,
  hooks: {
    async validateDelete({ item, context, addValidationError }) {
      const refs = await context.query.Client.count({
        where: { businessNumberType: { id: { equals: item.id } } },
      });
      refs > 0 &&
        addValidationError(
          "Cannot delete this Type, it is referenced by some clients"
        );
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
  },
});
