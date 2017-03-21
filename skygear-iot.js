const skygear = require('skygear');

module.exports = {
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
