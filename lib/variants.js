'use strict';

const privateMap = require('./private-map');
const request = require('request');

/**
* @module variants
*/

module.exports = {
  find: find,
  reset: reset
};

/**
  A function to get all the variants of a particular type for a push application or just 1 variant of a type for an application
  @param {object} options - An options object
  @param {string} options.pushAppId - The id of the push application
  @param {string} options.type - The type variant. - ex: android, ios, ....
  @param {string} [options.variantId] - the variantId to get
  @returns {Promise} A promise that will resolve with the Array of variant objects or if a variant is specified, just the variant object
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.variants.find(variantOptions)
        .then((variants) => {
        console.log(variants) // [{...},{...}, ...]
      });
    });
 */
function find(client) {
  return function find(options) {
    return new Promise((resolve, reject) => {
      options = options || {};
      const req = {
        url: options.variantId ? `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}/${options.variantId}` : `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}`,
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
  A function to reset an existing Variants Secret
  @param {object} options - An options object
  @param {string} options.pushAppId - The id of the push application
  @param {string} options.type - The type variant. - ex: android, ios, ....
  @param {string} options.variantId - the variantId to reset
  @returns {Promise} A promise that resolves with the update variant
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.variants.reset(variantOptions)
        .then((variant) => {
          console.log(variant); // {...}
      });
    });
 */
function reset(client) {
  return function reset(options) {
    return new Promise((resolve, reject) => {
      const req = {
        url: `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}/${options.variantId}/reset`,
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
