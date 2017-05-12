const fs = require('fs');
const cp = require('child_process');

const skygear = require('skygear');
const skygearIoT = require('skygear-iot')(skygear);

const {
  skygear: {
    apiKey,
    endPoint,
  },
  app: {
    version: appVersion
  }
} = require('./config.json');

function getDeviceSecret() {
  const cpu = new Map(
    fs.readFileSync('/proc/cpuinfo', 'utf8')
    .split('\n')
    .map(line => {
      const m = /(.+?)\t+: (.+)/.exec(line);
      return m ? [m[1],m[2]] : [null,null];
    })
  );
  return `${cpu.get('Hardware')}-${cpu.get('Revision')}-${cpu.get('Serial')}`;
}

const platform = {
  action: {
    async shutdown() {
      await skygearIoT.reportStatus({status: 'offline'});
      cp.execSync('sudo shutdown now');
    },
    async restart() {
      await skygearIoT.reportStatus({status: 'offline'});
      cp.execSync('sudo reboot');
    },
  },
  deviceSecret: getDeviceSecret(),
  appVersion: appVersion,
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
  } catch(_) {
    console.log('Login failed, trying sign-up ...');
    await skygear.signupWithUsername(
      platform.deviceSecret,
      platform.deviceSecret
    );
  }
  await skygearIoT.initDevice(platform);
  console.log(`Device ID: ${skygearIoT.device.id}`);
  console.log(`Application Version: ${appVersion}`);
  return require(`./app/${appVersion}`)(skygearIoT);
}

if(!(endPoint && apiKey)) {
  console.error('Error: Skygear Server not Configured!');
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

