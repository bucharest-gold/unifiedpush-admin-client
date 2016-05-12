'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');

test('test client should return a promise with the client object', (t) => {
    let baseUrl = 'http://127.0.0.1:8080/ag-push';

    let settings = {
        username: 'admin',
        password: 'admin'
    };

    const getToken = function () {
        return Promise.resolve('access token');
    };

    const adminClient = proxyquire('../../lib/unified-push-admin-client', {
        'keycloak-request-token': getToken
    });

    const upsClient = adminClient(baseUrl, settings);
    t.equal(upsClient instanceof Promise, true, 'should return a Promise');

    upsClient.then((client) => {
        t.equal(typeof client.baseUrl, 'string', 'client should contain a baseUrl String');
        t.equal(client.baseUrl, 'http://127.0.0.1:8080/ag-push', 'client should have a base url property');
        t.end();
    });
});


test('test client should return a promise with the client object - empty settings', (t) => {
    let baseUrl = 'http://127.0.0.1:8080/ag-push';

    const getToken = function () {
        return Promise.reject('no user/pass or something');
    };

    const adminClient = proxyquire('../../lib/unified-push-admin-client', {
        'keycloak-request-token': getToken
    });

    const upsClient = adminClient(baseUrl);
    t.equal(upsClient instanceof Promise, true, 'should return a Promise');

    upsClient.catch((client) => {
        t.end();
    });
});
