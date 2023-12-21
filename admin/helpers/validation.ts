import _ from "lodash";

export function validateClient(options: any) {
  if (
    _(options.item?.clientId).isNil() &&
    _(options.inputData.client).isNil()
  ) {
    options.addValidationError("Client is required");
  }
}
