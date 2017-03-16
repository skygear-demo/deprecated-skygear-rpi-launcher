const skygear = require('skygear');

const {
  endPoint,
  apiKey,
  username,
  password,
} = require('./config.json');

async function main() {
  console.log('### Skygear IoT Ping Test ###');
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log(`Skygear User: ${username}`);
  process.stdout.write('Initializing... ');
  await skygear.config({endPoint, apiKey});
  await skygear.loginWithUsername(username, password);
  console.log('Done!');

  // listen for 'pong' events
  skygear.on('pong', mac => {
    console.log(`[pong] ${mac}`);
  });

  console.log('Sending ping...')
  skygear.pubsub.publish('ping', {});

}

// handle system exceptions
main().catch(e => {
  console.error(e);
  process.exit(1);
});

