'use strict';

const privateMap = require('./private-map');
const request = require('request');

/**
* @module applications
*/

module.exports = {
  find: find,
  create: create,
  update: update,
  remove: remove,
  reset: reset
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

/**
  A function to update an existing Push Application
  @param {object} pushApp - The JSON representation of the push application to update.  pushApp.pushApplicationID and pushApp.name is required. ATM, it looks like the only fields that are updatable are name and description
  @returns {Promise} A promise that resolves with No Content
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.applications.update(pushApplication)
        .then(() => {
          console.log('success');
      });
    });
 */
function update(client) {
  return function update(pushApp) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/rest/applications/${pushApp.pushApplicationID}`,
        auth: {
          bearer: privateMap.get(client).accessToken
        },
        body: pushApp,
        json: true,
        method: 'PUT'
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 204) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}

/**
  A function to delete a Push Application
  @param {string} pushAppId - The id of the push application to delete
  @returns {Promise} A promise that resolves with No Content.
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.applications.remove(pushApplicationId)
        .then(() => {
          console.log('success');
      });
    });
 */
function remove(client) {
  return function remove(pushAppId) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/rest/applications/${pushAppId}`,
        auth: {
          bearer: privateMap.get(client).accessToken
        },
        json: true,
        method: 'DELETE'
      };

      request(req, (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        if (resp.statusCode !== 204) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}

/**
  A function to reset an existing Push Application's Master Secret
  @param {string} pushAppId - The push application id
  @returns {Promise} A promise that resolves with the update Push Application
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.applications.reset(pushApplicationId)
        .then((pushApplicaiton) => {
          console.log(pushApplication); // {...}
      });
    });
 */
function reset(client) {
  return function reset(pushAppId) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/rest/applications/${pushAppId}/reset`,
        auth: {
          bearer: privateMap.get(client).accessToken
        },
        json: true,
        method: 'PUT'
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
