'use strict';

const request = require('./common-request');

/**
* @module health
*/

module.exports = function health (client) {
  return function health () {
    const req = {
      url: `${client.baseUrl}/rest/sys/info/health`
    };

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 200) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
      });
  };
};
