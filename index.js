const skygear = require('skygear');
const {getMac} = require('getmac');

const {
  endPoint,
  apiKey,
  username,
  password,
} = require('./config.json');

async function main() {
  console.log('### Skygear IoT Client ###');
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log(`Skygear User: ${username}`);
  console.log('Initializing... ');
  await skygear.config({endPoint, apiKey});
  await skygear.loginWithUsername(username, password);
  console.log('Done!');

  // respond to 'ping' events with 'pong' event and device's MAC address
  skygear.on('ping', _ => {
    getMac((err, macAddress) => {
      if(err) throw err;
      skygear.pubsub.publish('pong', macAddress);
    });
  });

}

// handle system exceptions
main().catch(e => {
  console.error(e);
  process.exit(1);
});

