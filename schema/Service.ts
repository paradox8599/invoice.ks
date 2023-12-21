import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { virtual, text, decimal, relationship } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import _ from "lodash";

import type { Lists } from ".keystone/types";

import { decimalToDinero, Calc } from "../admin/helpers/money";

export const Service: Lists.Service = list({
  access: allowAll,
  hooks: {
    async validateDelete({ item, context, operation, addValidationError }) {
      if (operation === "delete") {
        const refs_quote = await context.query.Quote.count({
          where: { services: { some: { id: { equals: item.id } } } },
        });
        const refs_contract = await context.query.Contract.count({
          where: { services: { some: { id: { equals: item.id } } } },
        });
        const refs_invoice = await context.query.Invoice.count({
          where: { services: { some: { id: { equals: item.id } } } },
        });
        refs_quote + refs_contract + refs_invoice > 0 &&
          addValidationError(
            "Cannot delete this service, it is still referenced by other items."
          );
      }
    },
  },
  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, __, ctx) {
          const type = await ctx.query.ServiceType.findOne({
            where: { id: item.typeId },
            query: "name",
          });
          const unitPrice = decimalToDinero(item.unitPrice);
          const total = Calc.uTotal(unitPrice, item.qty.toNumber());
          const note = _(item.note).isEmpty() ? "" : `: ${item.note}`;
          return `[${total.toFormat("$0,0.00")}] ${type.name}${note}`;
        },
      }),
    }),
    note: text({ ui: { itemView: { fieldPosition: "sidebar" } } }),
    details: document({
      formatting: true,
      dividers: true,
      links: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
      ],
    }),
    unitPrice: decimal({
      label: "Unit Price ($)",
      validation: { isRequired: true },
      scale: 2,
      defaultValue: "1.00",
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    qty: decimal({
      validation: { isRequired: true },
      scale: 2,
      defaultValue: "1.00",
      ui: { itemView: { fieldPosition: "sidebar" } },
    }),
    price: virtual({
      label: "Price ($)",
      ui: { itemView: { fieldPosition: "sidebar" } },
      field: graphql.field({
        type: graphql.Float,
        resolve(item) {
          const unitPrice = decimalToDinero(item.unitPrice);
          const price = Calc.price(unitPrice, item.qty.toNumber());
          return price.toUnit();
        },
      }),
    }),
    gst: virtual({
      label: "GST ($)",
      ui: { itemView: { fieldPosition: "sidebar" } },
      field: graphql.field({
        type: graphql.Float,
        resolve(item) {
          const unitPrice = decimalToDinero(item.unitPrice);
          const price = Calc.price(unitPrice, item.qty.toNumber());
          const gst = Calc.gst(price);
          return gst.toUnit();
        },
      }),
    }),
    total: virtual({
      label: "Total ($)",
      ui: { itemView: { fieldPosition: "sidebar" } },
      field: graphql.field({
        type: graphql.Float,
        resolve(item) {
          const unitPrice = decimalToDinero(item.unitPrice);
          const price = Calc.price(unitPrice, item.qty.toNumber());
          const total = Calc.total(price);
          return total.toUnit();
        },
      }),
    }),

    type: relationship({
      ref: "ServiceType.services",
    }),
    quotes: relationship({
      ref: "Quote.services",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    contracts: relationship({
      ref: "Contract.services",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    invoices: relationship({
      ref: "Invoice.services",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
