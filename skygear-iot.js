const skygear = require('skygear');

module.exports = {
  deviceId: null,
  getDeviceString: function() {
    return new Promise((resolve,reject) => {
      fs.readFile('/proc/cpuinfo', 'utf8', (err,data) => {
        if(err) reject(err);
        let cpuinfo = {};
        data.split('\n').forEach(line => {
          const match = /(.+?)\t+: (.+)/.exec(line);
          if(match) cpuinfo[match[1]] = match[2];
        });
        resolve(`${cpuinfo['Hardware']}-${cpuinfo['Revision']}-${cpuinfo['Serial']}`);
      });
    });
  },
  pubsub: {
    one: function(event) {
      return new Promise(resolve => {
        function handler(data) {
          skygear.off(event, handler);
          resolve(data);
        }
        skygear.on(event, handler);
      });
    }
  }
}
