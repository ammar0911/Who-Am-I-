function pickPropertiesIfDefined<
  Object extends Record<string, any>,
  TAcceptedFields extends keyof Object,
>(
  object: Object,
  acceptedFields: TAcceptedFields[],
): Pick<Object, TAcceptedFields> {
  return Object.fromEntries(
    acceptedFields
      .filter((key) => key in object && object[key] !== undefined)
      .map((key) => [key, object[key]]),
  ) as Pick<Object, TAcceptedFields>;
}

export default pickPropertiesIfDefined;
