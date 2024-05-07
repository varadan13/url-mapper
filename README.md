Sure, here's an example implementation in Node.js using `kafka-node` for Kafka and `redis` for Redis:

1. **Set up Docker containers for Kafka and Redis**:
   - Make sure you have Docker installed.
   - Pull Kafka and Redis images from Docker Hub or use your custom Dockerfiles.
   - Create a Docker network to ensure communication between containers.

2. **Install required Node.js packages**:
   ```bash
   npm install kafka-node redis
   ```

3. **Write a Kafka consumer** (`kafkaConsumer.js`):
   ```javascript
   const kafka = require('kafka-node');

   const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
   const consumer = new kafka.Consumer(client, [{ topic: 'fetchSuburbList' }]);

   consumer.on('message', async (message) => {
       const suburb = message.value;
       console.log(`Received suburb: ${suburb}`);
       // Trigger function to get filters for the current suburb
       const filters = await getFiltersofCurrentSuburb(suburb);
       // Store filters in Redis
       await storeFiltersInRedis(suburb, filters);
   });

   async function getFiltersofCurrentSuburb(suburb) {
       // Implement function to fetch filters for the given suburb
       // Example: Make API call to fetch filters
       // Return filters as JSON object
   }

   async function storeFiltersInRedis(suburb, filters) {
       const redis = require('redis');
       const client = redis.createClient({ host: 'redis', port: 6379 });
       client.hmset(suburb, filters);
       console.log(`Filters stored in Redis for suburb: ${suburb}`);
       client.quit();
   }
   ```

4. **Run the Kafka consumer in a Docker container**:
   - Create a Dockerfile:
   ```Dockerfile
   FROM node:14

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY kafkaConsumer.js .

   CMD ["node", "kafkaConsumer.js"]
   ```
   - Build the Docker image:
   ```bash
   docker build -t kafka-consumer .
   ```
   - Run the Docker container:
   ```bash
   docker run --network your-network-name kafka-consumer
   ```

5. **Ensure Kafka and Redis containers are running**:
   ```bash
   docker run --network your-network-name --name kafka -p 9092:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT -d wurstmeister/kafka

   docker run --network your-network-name --name redis -p 6379:6379 -d redis
   ```

Replace `your-network-name` with the name of your Docker network.

This setup creates a Kafka consumer in Node.js that listens for messages on the `fetchSuburbList` topic. When a message is received, it triggers a function to fetch filters for the suburb and stores them in Redis. The Kafka consumer runs in a Docker container, ensuring it can communicate with Kafka and Redis containers.
