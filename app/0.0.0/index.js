const skygear = require('skygear');

async function main(skygearIoT) {
  console.log('### Skygear IoT Ping App ###');
  console.log('Listening for ping events...');
  while(true) {
    await skygear.pubsub.once('ping');
    console.log('Recieved ping.');
    skygear.pubsub.publish('pong', skygearIoT.device.id);
  }
}

module.exports = main;
