const skygear = require('skygear');
const skygearIot = require('../skygear-iot.js');

const {
  skygear: {
    deviceId
  }
} = require('../config.json');

async function main() {
  console.log('Listening for ping events...');
  while(true) {
    let pingData = await skygearIot.pubsub.one('ping');
    console.log(`[ping] ${pingData}`);
    skygear.pubsub.publish('pong', deviceId);
  }
}

module.exports = main();
