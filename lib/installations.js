'use strict';

const request = require('./common-request');

/**
* @module installations
*/

module.exports = {
  find: find,
  update: update,
  remove: remove
};

/**
  A function to get all the installations of a particular variant or just 1 installation
  @param {object} options - An options object
  @param {string} options.variantId - The id of the variant
  @param {string} [options.installationId] - the id of the installation to get
  @returns {Promise} A promise that will resolve with the Array of installation objects or if a installatonId is specified, just the installation object
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.installations.find(options)
        .then((installations) => {
        console.log(installations) // [{...},{...}, ...]
      });
    });
 */
function find(client) {
  return function find(options) {
    options = options || {};
    const req = {
      url: options.installationId ? `${client.baseUrl}/rest/applications/${options.variantId}/installations/${options.installationId}` : `${client.baseUrl}/rest/applications/${options.variantId}/installations/`
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

function update(client) {
    return function update(options) {
      options = options || {};
      const req = {
        url: `${client.baseUrl}/rest/applications/${options.variantId}/installations/${options.installationId}`,
        body: options.installation,
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

function remove(client) {
    return function remove(options) {
      options = options || {};
      const req = {
        url: `${client.baseUrl}/rest/applications/${options.variantId}/installations/${options.installationId}`,
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
