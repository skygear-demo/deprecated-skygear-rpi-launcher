const fs = require('fs');
const cp = require('child_process');

const skygear = require('skygear');
const skygearIoT = require('skygear-iot');

const {
  skygear: {
    apiKey,
    endPoint,
  },
  app: {
    version
  }
} = require('./config.json');

function getDeviceSecret() {
  const cpu = new Map(
    fs.readFileSync('/proc/cpuinfo', 'utf8')
    .split('\n')
    .map(line => {
      const m = /(.+?)\t+: (.+)/.exec(line);
      return m ? [m[1],m[2]] [null,null];
    })
  );
  return `${cpu.get('Hardware')}-${cpu.get('Revision')}-${cpu.get('Serial')}`;
}

const platform = {
  action: {
    shutdown() {
      cp.execSync('sudo shutdown now');
    },
    restart() {
      cp.execSync('sudo restart');
    },
  },
  deviceSecret: getDeviceSecret(),
  appVersion: version,
};

async function main() {
  console.log('### Skygear IoT RaspberryPi Launcher ###');
  console.log(`Skygear Endpoint: ${endPoint}`);
  console.log('Initializing...');
  await skygear.config({endPoint, apiKey});
  try {
    await skygear.loginWithUsername(
      platform.deviceSecret,
      platform.deviceSecret
    );
  } catch() {
    console.log('Login failed, trying sign-up ...');
    await skygear.signupWithUsername(
      platform.deviceSecret,
      platform.deviceSecret
    );
  }
  await skygearIoT.initDevice(platform);
  console.log('OK!');
  console.log(`Device ID: ${skygearIoT.device.id}`);
  console.log(`Application Version: ${version}`);
  return require(`./app/${version}`);
}

if(!(endPoint && apiKey)) {
  console.error('Error: Skygear Server not Configured!');
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

