type ExtractParams<T>
  = T extends `{${infer Param}}.${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<Rest>
    : T extends `${infer _Start}.{${infer Param}}${infer Rest}`
      ? { [K in Param]: string } & ExtractParams<Rest>
      : object

export function natsSubject<Topic extends string> (
  topic: Topic,
  parameters: ExtractParams<Topic>
): string {
  let filledTopic: string = topic

  for (const parameterName of Object.keys(parameters)) {
    const parameterValue = parameters[parameterName as keyof ExtractParams<Topic>]

    filledTopic = filledTopic.replaceAll(`{${parameterName}}`, parameterValue as string)
  }

  return filledTopic
}
