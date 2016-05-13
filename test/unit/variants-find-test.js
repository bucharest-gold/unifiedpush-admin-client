'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const nock = require('nock');

const baseUrl = 'http://127.0.0.1:8080/ag-push';

const settings = {
  username: 'admin',
  password: 'admin'
};

const app = { id: 'c915c94c-128a-416a-8493-5695e2c03626',
  name: 'first',
  description: 'This is the first app',
  pushApplicationID: '5d77107a-3624-4456-a8fa-37036274ff61',
  masterSecret: 'e5feb7a4-6780-4c5c-a897-1b1ce9803673',
  developer: 'admin',
  variants:
   [ { id: 'ca8ec1de-825d-4106-9ada-af5ee1802d37',
       name: 'andy android',
       description: null,
       variantID: '5fbccd78-1f14-4e5a-9497-a3e1b57b5505',
       secret: '62925c6f-5a02-46af-91f2-48c7a2b80426',
       developer: 'admin',
       googleKey: '2345',
       projectNumber: '432',
       type: 'android' },
     { id: 'c417d8d7-3aaa-4f17-a455-0ea1e55fec5c',
       name: 'windy windows',
       description: null,
       variantID: '6046b5d0-b61e-4d4e-b9ba-5c8e4e5248df',
       secret: 'a99b6414-8d5d-4656-a897-91d5702da339',
       developer: 'admin',
       sid: 'ms-app://123124141r13123123123123123',
       clientSecret: 'ww31231231231231232323',
       type: 'windows_wns' } ] };

// Don't need to worry about the getToken function
const getToken = function () {
  return Promise.resolve('access token');
};

const adminClient = proxyquire('../../lib/unified-push-admin-client', {
  'keycloak-request-token': getToken
});

test('test successful find of variants', (t) => {

  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    t.equal(typeof client.variants.find, 'function', 'The client object should have a client.variants.find function');


    const variantOptions = {
      pushAppId: app.pushApplicationID,
      type: 'android'
    };

    const getUrl = () => `/ag-push/rest/applications/${variantOptions.pushAppId}/${variantOptions.type}`;

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get(getUrl)
      .reply(200, () => { return app.variants.filter((v) => { return v.type === variantOptions.type; }); });

    // If successful, the server returns a 200 with an array of android variants
    client.variants.find(variantOptions).then((variants) => {
      t.equal(Array.isArray(variants), true, 'should be an array returned when finding all');
      t.end();
    });
  });
});

test('test successful find of variant', (t) => {

  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const variantOptions = {
      pushAppId: app.pushApplicationID,
      type: 'android',
      variantId: '5fbccd78-1f14-4e5a-9497-a3e1b57b5505'
    };

    const getUrl = () => `/ag-push/rest/applications/${variantOptions.pushAppId}/${variantOptions.type}/${variantOptions.variantId}`;

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get(getUrl)
      .reply(200, () => { return app.variants.filter((v) => { return v.variantID === variantOptions.variantId; })[0]; });

    // If successful, the server returns a 200 with an array of android variants
    client.variants.find(variantOptions).then((variant) => {
      t.equal(Array.isArray(variant), false, 'should be an array returned when finding all');
      t.equal(variant.type, variantOptions.type, 'the variant types should be equal');
      t.end();
    });
  });
});


test('test error with a non 200 response code', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const variantOptions = {
      pushAppId: app.pushApplicationID,
      type: 'android'
    };

    const getUrl = () => `/ag-push/rest/applications/${variantOptions.pushAppId}/${variantOptions.type}`;

    nock('http://127.0.0.1:8080')
      .matchHeader('authorization', 'Bearer access token')
      .get(getUrl)
      .reply(400, {});

    // If successful, the server returns a 200 with an array of android variants
    client.variants.find(variantOptions).catch(() => {
      t.end();
    });
  });
});
