import { Lists } from "../admin/helpers/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  virtual,
  checkbox,
  timestamp,
  calendarDay,
  relationship,
} from "@keystone-6/core/fields";

import { Calc } from "../admin/helpers/money";
import { validateClient } from "../admin/helpers/hooks";
import { createdAtField, updatedAtField } from "../admin/helpers/fields";

export const Quote: Lists.Quote = list({
  access: allowAll,

  fields: {
    name: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, _args, ctx) {
          const services = await ctx.query.Service.findMany({
            where: { quotes: { some: { id: { equals: item.id } } } },
            query: "total",
          });
          const total = Calc.sum(services as any[], "total");

          return `$${total.toUnit()}, ${
            item.displayDate?.toLocaleString() ||
            item.createdAt?.toLocaleString()
          }`;
        },
      }),
    }),
    sentAt: timestamp({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    accepted: checkbox({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
      },
    }),
    displayDate: calendarDay({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
      },
    }),

    client: relationship({
      ref: "Client.quotes",
      hooks: { validateInput: validateClient },
      ui: {
        createView: { fieldMode: "edit" },
        itemView: { fieldMode: "read", fieldPosition: "sidebar" },
      },
    }),
    services: relationship({ ref: "Service.quotes", many: true }),
    price: virtual({
      label: "Price ($)",
      field: graphql.field({
        type: graphql.Float,
        async resolve(item, _args, ctx) {
          const services = await ctx.query.Service.findMany({
            where: { quotes: { some: { id: { equals: item.id } } } },
            query: "price",
          });
          const sum = Calc.sum(services as any[], "price");
          return sum.toUnit();
        },
      }),
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
      },
    }),
    gst: virtual({
      label: "GST ($)",
      field: graphql.field({
        type: graphql.Float,
        async resolve(item, _args, ctx) {
          const services = await ctx.query.Service.findMany({
            where: { quotes: { some: { id: { equals: item.id } } } },
            query: "gst",
          });
          const sum = Calc.sum(services as any[], "gst");
          return sum.toUnit();
        },
      }),
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
      },
    }),
    total: virtual({
      label: "Total ($)",
      field: graphql.field({
        type: graphql.Float,
        async resolve(item, _args, ctx) {
          const services = await ctx.query.Service.findMany({
            where: { quotes: { some: { id: { equals: item.id } } } },
            query: "total",
          });
          const sum = Calc.sum(services as any[], "total");
          return sum.toUnit();
        },
      }),
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
      },
    }),

    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
