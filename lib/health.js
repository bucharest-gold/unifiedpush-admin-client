'use strict';

const privateMap = require('./private-map');
const request = require('request');

/**
* @module health
*/

module.exports = function health (client) {
  return function health() {
    return new Promise((resolve, reject) => {
        const req = {
        url: `${client.baseUrl}/rest/sys/info/health`,
        auth: {
          bearer: privateMap.get(client).accessToken
        },
        json: true
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 200) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
};
