'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const nock = require('nock');

const baseUrl = 'http://127.0.0.1:8080/ag-push';

const settings = {
  username: 'admin',
  password: 'admin'
};

const healthEndpointResult = {
  status: 'ok',
  details:
   [ { description: 'Database connection',
       result: 'connected',
       runtime: 52,
       test_status: 'ok' },
     { description: 'Google Cloud Messaging',
       result: 'online',
       runtime: 52,
       test_status: 'ok' },
     { description: 'Apple Push Network Sandbox',
       result: 'online',
       runtime: 96,
       test_status: 'ok' },
     { description: 'Apple Push Network Production',
       result: 'online',
       runtime: 105,
       test_status: 'ok' },
     { description: 'Windows Push Network',
       result: 'online',
       runtime: 236,
       test_status: 'ok' } ],
  summary: 'Everything is ok' };

// Don't need to worry about the getToken function
const getToken = function () {
  return Promise.resolve('access token');
};

const adminClient = proxyquire('../../lib/unified-push-admin-client', {
  'keycloak-request-token': getToken
});

test('test successful health endpoint', (t) => {

  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    t.equal(typeof client.health, 'function', 'The client object should have a client.health function');

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get('/ag-push/rest/sys/info/health')
      .reply(200, healthEndpointResult);

    // If successful, the server returns a 200 with an array of push applications
    client.health().then((applications) => {
      t.end();
    });
  });
});
