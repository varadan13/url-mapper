import { GraphQLClient } from "graphql-request";

const initClient = (config) => {
  const client = new GraphQLClient(config.endpoint, {
    headers: {
      "x-api-key": config.apiKey,
    },
  });
  return client;
};

export default initClient;
