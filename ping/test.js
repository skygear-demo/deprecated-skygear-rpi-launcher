const skygear = require('skygear');

const {
  skygear: {
    endPoint,
    apiKey,
    deviceId,
    password,
  }
} = require('../config.json');

const {
  version: skygearIotVersion
} = require('../package.json');

async function main() {
  console.log('### Skygear IoT Ping Test ###');
  await skygear.config({endPoint, apiKey});
  console.log(`Skygear IoT Version: ${skygearIotVersion}`);
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log(`Device ID: ${deviceId}`);
  console.log('Initializing... ');
  await skygear.loginWithUsername(deviceId, password);
  console.log('Done!');

  // listen for 'pong' events
  skygear.on('pong', data => {
    console.log(`[pong] ${data}`);
  });

  console.log('Sending ping...')
  skygear.pubsub.publish('ping', {});

}

// handle system exceptions
main().catch(e => {
  console.error(e);
  process.exit(1);
});

