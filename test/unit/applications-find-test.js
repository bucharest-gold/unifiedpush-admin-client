'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const nock = require('nock');

const baseUrl = 'http://127.0.0.1:8080/ag-push';

const settings = {
  username: 'admin',
  password: 'admin'
};

const apps = [
  {
    name: 'app 1',
    pushApplicationID: '12345'
  },
  {
    name: 'app 2',
    pushApplicationID: '54321'
  }
];

// Don't need to worry about the getToken function
const getToken = function () {
  return Promise.resolve('access token');
};

const adminClient = proxyquire('../../lib/unified-push-admin-client', {
  'keycloak-request-token': getToken
});

test('test successful find of applications', (t) => {

  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    t.equal(typeof client.applications.find, 'function', 'The client object should have a client.applications.find function');

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get('/ag-push/rest/applications/')
      .reply(200, apps);

    // If successful, the server returns a 200 with an array of push applications
    client.applications.find().then((applications) => {
      t.equal(applications.length, apps.length, 'the applications returned should be same as the apps from above');
      t.equal(Array.isArray(applications), true, 'should be an array returned when finding all');
      t.end();
    });
  });
});

test('test successful find of 1 application', (t) => {
  const adminClient = proxyquire('../../lib/unified-push-admin-client', {
    'keycloak-request-token': getToken
  });
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get('/ag-push/rest/applications/12345')
      .reply(200, apps[0]);

    // If successful, the server returns a 200 with an array of push applications
    client.applications.find('12345').then((application) => {
      t.equal(Array.isArray(application), false, 'should be an array returned when finding all');
      t.equal(application.name, 'app 1', 'should be the name of the first app');
      t.end();
    });
  });
});


test('test error with a non 200 response code', (t) => {
  const adminClient = proxyquire('../../lib/unified-push-admin-client', {
    'keycloak-request-token': getToken
  });
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get('/ag-push/rest/applications/')
      .reply(400, {});

    // If successful, the server returns a 200 with an array of push applications
    client.applications.find().catch(() => {
      // since this is just a unit test, we are only testing that this actually happens on a non 200
      t.end();
    });
  });
});
