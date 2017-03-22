const skygear = require('skygear');
const skygearIot = require('../skygear-iot.js');

async function main() {
  console.log('Listening for ping events...');
  while(true) {
    await skygearIot.pubsub.one('ping');
    console.log('Recieved ping.');
    skygear.pubsub.publish('pong', skygearIot.deviceId);
  }
}

module.exports = main();
