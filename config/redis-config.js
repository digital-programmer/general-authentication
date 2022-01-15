const redis = require('redis');
const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST,
    {
        'auth_pass': process.env.REDIS_PASSWORD,
        'return_buffers': true
    }
).on('error', (err) => console.error('ERR:REDIS:', err));

client.once('open', () => {
    console.log('Connected to Redis server');
})

module.exports = client;
