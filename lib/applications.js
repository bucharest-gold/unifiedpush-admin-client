'use strict';

const request = require('./common-request');

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
    const req = {
      url: pushAppId ? `${client.baseUrl}/rest/applications/${pushAppId}` : `${client.baseUrl}/rest/applications/`,
    };

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 200) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
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
    const req = {
      url: `${client.baseUrl}/rest/applications/`,
      body: pushApp,
      method: 'POST'
    };

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 201) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
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
    const req = {
      url: `${client.baseUrl}/rest/applications/${pushApp.pushApplicationID}`,
      body: pushApp,
      method: 'PUT'
    };

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 204) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
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
    const req = {
      url: `${client.baseUrl}/rest/applications/${pushAppId}`,
      method: 'DELETE'
    };

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 204) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
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
    const req = {
      url: `${client.baseUrl}/rest/applications/${pushAppId}/reset`,
      method: 'PUT'
    };

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 200) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
      });
  };
}
