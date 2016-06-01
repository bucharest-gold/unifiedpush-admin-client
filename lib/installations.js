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

/**
  A function to update an existing installation.
  @param {object} options - An options object that is the JSON representation of the Variant to Update
  @param {string} options.variantId - The id of the push application
  @param {object} options.installation - the installation object
  @param {string} options.installation.id - The id of the installation to be updated
  @param {string} options.installation.deviceToken - the deviceToken of the installation
  @param {string} [options.installation.alias] - string to map the Installation to an actual user.
  @param {boolean} [options.installation.enabled] - Flag if the actual client installation is enabled (default) or not.
  @param {string} [options.installation.platform] - the name of the platform. FOR ADMIN UI ONLY - Helps with setting up Routes
  @param {string} [options.installation.deviceType] - the type of the registered device
  @param {string} [options.installation.operatingSystem] - the name of the Operating System.
  @param {string} [options.installation.osVersion] - the version string of the mobile OS.
  @params {Array} [options.installation.categories] - set of all categories the client is in
  @returns {Promise} A promise that resolves with No Content
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.installations.update(installationOptions)
        .then(() => {
        console.log('success')
      });
    });
 */
function update(client) {
    return function update(options) {
      options = options || {};
      const req = {
        url: `${client.baseUrl}/rest/applications/${options.variantId}/installations/${options.installation.id}`,
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

/**
  A function to remove an installation
  @param {object} options - An options object
  @param {string} options.variantId - The id of the variant
  @param {string} options.installationId - the id of the installation to remove
  @returns {Promise} A promise that will resolve
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.installations.remove(options)
        .then(() => {
        console.log('success');
      });
    });
 */
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
