const skygear = require('skygear');

const {
  skygear: {
    deviceId
  }
} = require('../config.json');

function onEvent(event) {
  return new Promise(resolve => {
    function handler(data) {
      skygear.off(event, handler);
      resolve(data);
    }
    skygear.on(event, handler);
  });
}

async function main() {
  console.log('Listening for ping events...');
  while(true) {
    let pingData = await onEvent('ping');
    console.log(`[ping] ${pingData}`);
    skygear.pubsub.publish('pong', deviceId);
  }
}

module.exports = main();
