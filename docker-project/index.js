const kafka = require('kafka-node');

const dummyObj = ["frankston1-victoria","melbourne1-victoria","frankston2-victoria","melbourne2-victoria","frankston3-victoria","melbourne3-victoria"];

const filters ={"frankston1-victoria":[1,2,3,4],"melbourne1-victoria":[1,2,3,4],"frankston2-victoria":[1,2,3,4],"melbourne2-victoria":[1,2,3,4],"frankston3-victoria":[1,2,3,4],"melbourne3-victoria":[1,2,3,4]}

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });

const consumer = new kafka.Consumer(client, [{ topic: 'fetchSuburbList' }]);

const producer = new kafka.Producer(client);

payloads = [
    { topic: 'fetchSuburbList', messages: 'frankston1-victoria' },
    { topic: 'fetchSuburbList', messages: 'melbourne1-victoria' },
    { topic: 'fetchSuburbList', messages: 'melbourne2-victoria' },
    { topic: 'fetchSuburbList', messages: 'melbourne3-victoria' },    
    { topic: 'fetchSuburbList', messages: 'frankston2-victoria' },
    { topic: 'fetchSuburbList', messages: 'frankston3-victoria'},
];

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    })})

consumer.on('message', async (message) => {
    const suburb = message.value;
    console.log(`Received suburb: ${suburb}`);
    const filters = await getFiltersofCurrentSuburb(suburb);
    await storeFiltersInRedis(suburb, filters);
});

async function getFiltersofCurrentSuburb(suburb) {
    return filters[suburb]
}

async function storeFiltersInRedis(suburb, filters) {
    const redis = require('redis');
    const client = redis.createClient({ host: 'redis', port: 6379 });
    client.hmset(suburb, filters);
    console.log(`Filters stored in Redis for suburb: ${suburb}`);
    client.quit();
}