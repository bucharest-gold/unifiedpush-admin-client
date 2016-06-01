'use strict';

/**
* @module unified-push-admin-client
*/

const privateMap = require('./private-map');
const url = require('url');
const getToken  = require('keycloak-request-token');

// Public API
const applications = require('./applications');
const health = require('./health');
const deviceTypes = require('./device-types');
const variants = require('./variants');
const installations = require('./installations');

function authenticate(client, settings) {
  // Need to construct the Keycloak URL based on the push server url.
  // This will probably change once the keycloak server is decoupled from the push server,  but we can worry about that later.
  const parsedUrl = url.parse(settings.kcUrl || client.baseUrl);
  const kcUrl = `${parsedUrl.protocol}//${parsedUrl.host}/auth`;

  // Again, since KC is coupled with the UPS, we can assume these values for now.
  // Make sure that client has Direct Acccess Grants enabled
  settings.grant_type = 'password';
  settings.client_id = 'unified-push-server-js';
  settings.realmName = settings.kcRealmName || 'aerogear';

  return getToken(kcUrl, settings)
    .then((token) => {
      privateMap.get(client).accessToken = token;

      return client;
    });
}

/**
  Creates a new UnifiedPush Admin client
  @param {string} baseUrl - The baseurl for the AeroGear UnifiedPush server - ex: http://localhost:8080/ag-push,
  @param {object} settings - an object containing the settings
  @param {string} settings.username - The username to login to the UnifiedPush server - ex: admin
  @param {string} settings.password - The password to login to the UnifiedPush server - ex: *****
  @param {string} [settings.kcUrl] - The URL to the keycloak server
  @param {string} [settings.realmName] - the realm name the Unified Push Server is under in Keycloak - defaults to aerogear
  @returns {Promise} A promise that will resolve with the client object.
  @instance
  @example

  const adminClient = require('unifiedpush-admin-client');
  const settings = {
    baseUrl: 'http://127.0.0.1:8080/ag-push',
    username: 'admin',
    password: 'admin'
  };

  adminClient(settings)
    .then((client) => {
      client.realms()
      ...
      ...
    });
 */
function unifiedPushAdminClient(baseUrl, settings) {
  settings = settings || {};

  const data = {};
  const client = {
    applications: {},
    variants: {},
    installations: {}
  };

  // Add in the Applications functions
  for (let func in applications) {
    client.applications[func] = applications[func](client);
  }

  // Add in the Variant functions
  for (let func in variants) {
    client.variants[func] = variants[func](client);
  }

  // Add in the Installations functions
  for (let func in installations) {
    client.installations[func] = installations[func](client);
  }

  // Make device types constant public for convienence
  client.DEVICE_TYPES = deviceTypes;

  // Add in the health endpoint
  client.health = health(client);

  client.baseUrl = baseUrl;

  privateMap.set(client, data);

  return authenticate(client, settings);
}


module.exports = unifiedPushAdminClient;
