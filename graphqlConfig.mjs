import dotenv from "dotenv";

dotenv.config();

const graphqlConfig = {
  dev: {
    apiKey: process.env.DEV_API_KEY,
    endpoint: process.env.DEV_ENDPOINT,
  },
  prod: {
    apiKey: process.env.PROD_API_KEY,
    endpoint: process.env.PROD_ENDPOINT,
  },
};

export default graphqlConfig;
