'use strict';

const privateMap = require('./private-map');
const request = require('request');

/**
* @module applications
*/

module.exports = {
  find: find,
  create: create
};

/**
  A function to get all the push applications or just 1 push application
  @param {string} [pushAppId] - The id of the push application
  @returns {Promise} A promise that will resolve with the Array of application objects or if a pushAppId is specified, just the application object
  @example
  adminClient(baseUrl, settings)
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

/**
  A function to create a new Push Application
  @param {object} pushApp - The JSON representation of the push application to create.  pushApp.name is required
  @returns {Promise} A promise that resolves with the JSON representation of the created push application.
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.applications.create(pushApplication)
        .then((newPushApp) => {
          console.log(newPushApp); //{...}
      });
    });
 */
function create(client) {
  return function create(pushApp) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/rest/applications/`,
        auth: {
          bearer: privateMap.get(client).accessToken
        },
        body: pushApp,
        json: true,
        method: 'POST'
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 201) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}
