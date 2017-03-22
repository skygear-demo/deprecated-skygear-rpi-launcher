const fs = require('fs');
const crypto = require('crypto');
const skygear = require('skygear');
const skygearIot = require('./skygear-iot.js');

const {
  skygear: {
    apiKey,
    endPoint,
  }
} = require('./config.json');

const {
  version: skygearIotVersion
} = require('./package.json');

async function main() {
  console.log('### Skygear IoT Client ###');
  console.log(`Skygear IoT Version: ${skygearIotVersion}`);
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log('Initializing...');
  await skygear.config({endPoint, apiKey});
  const deviceString = await skygearIot.getDeviceString();
  let deviceUser = null;
  try {
    deviceUser = await skygear.signupWithUsername(deviceString, deviceString);
  } catch(_) {
    deviceUser = await skygear.loginWithUsername(deviceString, deviceString);
  }
  console.log(`Device ID: ${deviceUser.id}`);
  skygearIot.deviceId = deviceUser.id;
  try {
    console.log(`Loading User Application...`);
    const {version} = require('./user-app/package.json');
    console.log(`Application Version: ${version}`);
    return require('./user-app');
  } catch(err) {
    console.error(err);
    console.log('Falling back to default application...');
    return require('./ping/index.js');
  }
}

if(!(endPoint && apiKey)) {
  console.error('Error: Skygear Server not Configured!');
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

