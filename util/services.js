const Promise = require('./bluebird.core.min');

export default {
  fetch(obj) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: obj.url,
        method: obj.method,
        data: obj.data,
        header: {
          'Accept': 'application/json'
        },
        success: resolve,
        fail: reject
      });
    });
  }
};
