'use strict';

const request = require('./common-request');
const fs = require('fs');

/**
* @module applications
*/

module.exports = {
  find: find,
  create: create,
  update: update,
  remove: remove,
  reset: reset,
  bootstrap: bootstrap
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

/**
  A Convenience function to create a complete Push Application with a set of variants
  @param {object} pushApp - The push application object
  @param {string} pushApp.pushApplicationName - The name of the Push Application
  @param {string} [pushApp.androidVariantName] - Android Variant Name
  @param {string} [pushApp.androidGoogleKey] - The Google Cloud Messaging Key. Required For Android
  @param {string} [pushApp.androidProjectNumber] - The Google Project Number
  @param {string} [pushApp.iosVariantName] - iOS Variant Name
  @param {string} [pushApp.iosProduction] - defaults to false - flag to indicate if a connection to Apples production or sandbox APNS server
  @param {string} [pushApp.iosPassphrase] - The APNs passphrase that is needed to establish a connection to any of Apple's APNs Push Servers.
  @param {string|Buffer|Stream} [pushApp.iosCertificate] - the full location of the APNs certificate that is needed to establish a connection to any of Apple's APNs Push Servers.
  @param {string} [pushApp.windowsType] - mpns or wns
  @param {string} [pushApp.windowsVariantName] - Windows Variant Name
  @param {string} [pushApp.windowsSid] - *for wns only* - (Package security identifier) used to connect to the windows push notification services
  @param {string} [pushApp.windowsClientSecret] - *for wns only* - The client secret (password) to connect to the windows push notification services
  @param {string} [pushApp.simplePushVariantName] - SimplePush Variant Name
  @param {string} [pushApp.admVariantName] - Amazon Variant Name
  @param {string} [pushApp.admClientId] - The client id to connect to the Amazon Device Messaging services
  @param {string} [pushApp.admClientSecret] - The client secret (password) to connect to the Amazon Device Messaging services
  @returns {Promise} A promise that resolves with the update Push Application
  @example
  adminClient(baseUrl, settings)
    .then((client) => {
      client.applications.boostrap(pushApp)
        .then((pushApplicaiton) => {
          console.log(pushApplication); // {...}
      });
    });
 */
function bootstrap(client) {
  return function bootstrap(pushApp) {
    const req = {
      url: `${client.baseUrl}/rest/applications/bootstrap`,
      method: 'POST'
    };

    const data = pushApp;

    // If they send in a string, then lets assume that is the location of the cert file
    // Otherwise, we will assume it is a Stream or Buffer and can just pass it along
    if (data.iosVariantName) {
      if (typeof data.iosCertificate === 'string') {
        data.iosCertificate = fs.createReadStream(data.iosCertificate);
      }

      data.iosProduction = data.iosProduction ? 'true' : 'false';
    }

    req.formData = data;

    return request(client, req)
      .then((response) => {
        if (response.resp.statusCode !== 201) {
          return Promise.reject(response.body);
        }

        return Promise.resolve(response.body);
      });
  };
}
