const privateMap = require('./private-map');
const request = require('request');

module.exports = function doRequest(client, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    const baseOptions = {
      auth: {
        bearer: privateMap.get(client).accessToken
      },
      json: true
    };

    // merge the 2 objects together, make the options be the thing that can override
    const req = Object.assign({}, baseOptions, options);

    request(req, (err, resp, body) => {
      if (err) {
        return reject(err);
      }

      return resolve({resp: resp, body: body});
    });
  });
};
