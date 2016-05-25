'use strict';

const request = require('./common-request');
const fs = require('fs');

/**
* @module variants
*/

module.exports = {
  find: find,
  create: create,
  update: update,
  remove: remove,
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
    options = options || {};
    const req = {
      url: options.variantId ? `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}/${options.variantId}` : `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}`,
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
  A function to create a variant of a particular type.

  @param {object} options - An options object
  @param {string} options.pushAppId - The id of the push application
  @param {string} options.type - The type variant. - ex: android, ios, ....

  All Variants will have a type, name, and an optional description
  @param {string} options.name - The name of the variant
  @param {string} [options.description] - The description of the variant

  ** For SimplePush **
  Nothing else required

  ** For iOS **
  @param {object} [options.ios] - The specific iOS options
  @param {string} [options.ios.passphrase] - The APNs passphrase that is needed to establish a connection to any of Apple's APNs Push Servers.
  @param {string|Buffer|Stream} [options.ios.certficate] - the full location of the APNs certificate that is needed to establish a connection to any of Apple's APNs Push Servers.
  @param {boolean} [options.ios.production] - defaults to false - flag to indicate if a connection to Apples production or sandbox APNS server


  ** For Android **
  @param {object} [options.android] - The specific Android options
  @param {string} [options.android.googleKey] - The Google Cloud Messaging Key. Required For Android
  @param {string} [options.android.projectNumber] - The Google Project Number

  ** For ADM - Amazon Push **
  @param {object} [options.adm] - The specific ADM options
  @param {string} [options.adm.clientId] - The client id to connect to the Amazon Device Messaging services
  @param {string} [options.adm.clientSecret] - The client secret (password) to connect to the Amazon Device Messaging services
  @returns {Promise} A promise that will resolve with the Array of variant objects or if a variant is specified, just the variant object
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.variants.create(variantOptions)
        .then((variant) => {
        console.log(variant) // {...}
      });
    });
 */
function create(client) {
  return function create(options) {
    options = options || {};

    const req = {
      url: `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}`,
      method: 'POST'
    };

    const data = {
      name: options.name,
      description: options.description
    };

    if (options.type !== 'ios') {
      for(let key in options[options.type]) {
        data[key] = options[options.type][key];
      }

      req.body = data;
    } else {
      data.passphrase = options.ios.passphrase;
      data.production = options.ios.production ? 'true' : 'false';

      // If they send in a string, then lets assume that is the location of the cert file
      // Otherwise, we will assume it is a Stream or Buffer and can just pass it along
      if (typeof options.ios.certificate === 'string') {
        data.certificate = fs.createReadStream(options.ios.certificate);
      } else {
        data.certificate = options.ios.certificate;
      }

      // need to clean up the description field if it is undefined, doing multipart with request barfs if this is null
      if (!data.description) {
        delete data.description;
      }

      req.formData = data;
    }

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
  A function to update an existing Variant.
  @param {object} options - An options object that is the JSON representation of the Variant to Update
  @param {string} options.pushAppId - The id of the push application
  @param {string} options.variantId - The id of the variant to be updated
  @param {string} options.type - The type variant. - ex: android, ios, ....

  All Variants will have a type, name, and an optional description
  @param {string} options.name - The name of the variant
  @param {string} [options.description] - The description of the variant

  ** For SimplePush **
  Nothing else required

  ** For iOS **
  @param {object} [options.ios] - The specific iOS options
  @param {string} [options.ios.passphrase] - The APNs passphrase that is needed to establish a connection to any of Apple's APNs Push Servers.
  @param {string|Buffer|Stream} [options.ios.certficate] - the full location of the APNs certificate that is needed to establish a connection to any of Apple's APNs Push Servers.
  @param {boolean} [options.ios.production] - defaults to false - flag to indicate if a connection to Apples production or sandbox APNS server


  ** For Android **
  @param {object} [options.android] - The specific Android options
  @param {string} [options.android.googleKey] - The Google Cloud Messaging Key. Required For Android
  @param {string} [options.android.projectNumber] - The Google Project Number

  ** For ADM - Amazon Push **
  @param {object} [options.adm] - The specific ADM options
  @param {string} [options.adm.clientId] - The client id to connect to the Amazon Device Messaging services
  @param {string} [options.adm.clientSecret] - The client secret (password) to connect to the Amazon Device Messaging services

  @returns {Promise} A promise that resolves with No Content
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.variants.update(variantToUpdate)
        .then(() => {
        console.log('success')
      });
    });
 */
function update(client) {
  return function update(options) {
    options = options || {};

    const req = {
      url: `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}/${options.variantId}`,
      method: 'PUT'
    };

    const data = {
      name: options.name,
      description: options.description
    };

    if (options.type !== 'ios') {
      for(let key in options[options.type]) {
        data[key] = options[options.type][key];
      }

      req.body = data;
    } else {
      data.passphrase = options.ios.passphrase;
      data.production = options.ios.production ? 'true' : 'false';

      // If they send in a string, then lets assume that is the location of the cert file
      // Otherwise, we will assume it is a Stream or Buffer and can just pass it along
      if (typeof options.ios.certificate === 'string') {
        data.certificate = fs.createReadStream(options.ios.certificate);
      } else {
        data.certificate = options.ios.certificate;
      }

      // need to clean up the description field if it is undefined, doing multipart with request barfs if this is null
      if (!data.description) {
        delete data.description;
      }

      req.formData = data;
    }


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
  A function to remove a variant of a particular type for a push application
  @param {object} options - An options object
  @param {string} options.pushAppId - The id of the push application
  @param {string} options.type - The type variant. - ex: android, ios, ....
  @param {string} options.variantId - the variantId to get
  @returns {Promise}  A promise that resolves with No Content.
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.variants.remove(variantOptions)
        .then(() => {
        console.log('success')
      });
    });
 */
function remove(client) {
  return function remove(options) {
    options = options || {};

    const req = {
      url: `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}/${options.variantId}`,
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
    options = options || {};
    const req = {
      url: `${client.baseUrl}/rest/applications/${options.pushAppId}/${options.type}/${options.variantId}/reset`,
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
