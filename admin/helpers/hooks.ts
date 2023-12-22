import _ from "lodash";
import type { Lists } from ".keystone/types";
import {
  BaseListTypeInfo,
  KeystoneContextFromListTypeInfo,
} from "@keystone-6/core/types";

export function validateClient(options: any) {
  if (
    _(options.item?.clientId).isNil() &&
    _(options.inputData.client).isNil()
  ) {
    options.addValidationError("Client is required");
  }
}

/// Import services from srouce collection to target collection
export async function importServices({
  fromCollection,
  toCollection,
  fromId,
  toId,
  context,
}: {
  fromCollection: keyof Lists;
  toCollection: keyof Lists;
  fromId?: string;
  toId: string;
  context: KeystoneContextFromListTypeInfo<any>;
}) {
  if (!fromId) return;
  const srcData = await context.query[fromCollection].findOne({
    where: { id: fromId },
    query: "services { id }",
  });
  await context.query[toCollection].updateOne({
    where: { id: toId },
    data: {
      services: { connect: srcData.services },
    },
  });
}
