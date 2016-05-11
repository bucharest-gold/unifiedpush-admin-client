'use strict';

const privateMap = require('./private-map');
const request = require('request');

/**
* @module applications
*/

module.exports = {
  find: find
};

/**
  A function to get all the push applications or just 1 push application
  @param {string} [pushAppId] - The id of the push application
  @returns {Promise} A promise that will resolve with the Array of application objects or if a pushAppId is specified, just the application object
  @example
  adminClient(settings)
    .then((client) => {
      client.applications.find()
        .then((applications) => {
        console.log(applications) // [{...},{...}, ...]
      });
    });
 */
function find(client) {
  return function find(pushAppId) {
    return new Promise((resolve, reject) => {
      const req = {
        url: pushAppId ? `${client.baseUrl}/rest/applications/${pushAppId}` : `${client.baseUrl}/rest/applications/`,
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
}
