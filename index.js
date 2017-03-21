const fs = require('fs');
const crypto = require('crypto');
const skygear = require('skygear');

const {
  skygear: {
    apiKey,
    endPoint,
    deviceId,
    password,
  }
} = require('./config.json');

const {
  version: skygearIotVersion
} = require('./package.json');

function genDeviceId() {
  return new Promise((resolve,reject) => {
    fs.readFile('/proc/cpuinfo', 'utf8', (err,data) => {
      if(err) reject(err);
      const time = Date.now();
      let cpuinfo = {};
      data.split('\n').forEach(line => {
        const match = /(.+?)\t+: (.+)/.exec(line);
        if(match) cpuinfo[match[1]] = match[2];
      });
      resolve(`${cpuinfo['Hardware']}-${cpuinfo['Revision']}-${cpuinfo['Serial']}-${time}`);
    });
  });
}

function genPassword() {
  return new Promise((resolve,reject) => {
    crypto.randomBytes(32, (err,buf) => {
      if(err) reject(err);
      resolve(buf.toString('hex'));
    });
  });
}

function writeConfig(config) {
  return new Promise((resolve,reject) => {
    fs.writeFile(
      './config.json',
      JSON.stringify(config, null, 2),
      e => e ? reject(e) : resolve()
    );
  });
}

async function setup() {
  console.log('Running Skygear IoT Setup...');
  const deviceId = await genDeviceId();
  const password = await genPassword();
  console.log(`Skygear IoT Version: ${skygearIotVersion}`);
  console.log(`Device ID: ${deviceId}`);
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log('Registering Device...');
  await skygear.config({endPoint, apiKey});
  await skygear.signupWithUsername(deviceId, password);
  console.log('Done!');
  console.log('Writing Config...');
  let config = require('./config.json');
  config.skygear.deviceId = deviceId;
  config.skygear.password = password;
  await writeConfig(config);
  console.log('Setup Complete!');
  process.exit(0);
}

async function main() {
  console.log('### Skygear IoT Client ###');
  console.log(`Skygear IoT Version: ${skygearIotVersion}`);
  console.log(`Device ID: ${deviceId}`);
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log('Initializing...');
  await skygear.config({endPoint, apiKey});
  await skygear.loginWithUsername(deviceId, password);
  console.log('Done!');
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

// run initial setup if device ID is null
(deviceId?main:setup)().catch(err => {
  console.error(err);
  process.exit(1);
});

