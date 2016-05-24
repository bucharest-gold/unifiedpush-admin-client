'use strict';

const test = require('tape');
const adminClient = require('../../');

test('test client should return a promise with the client object', (t) => {
    let baseUrl = 'http://localhost:8082/ag-push';

    let settings = {
        username: 'admin',
        password: 'admin',
        kcUrl: 'http://localhost:8080/auth',
        kcRealmName: 'master'
    };

    const upsClient = adminClient(baseUrl, settings);
    t.equal(upsClient instanceof Promise, true, 'should return a Promise');

    upsClient.then((client) => {
        t.equal(typeof client.baseUrl, 'string', 'client should contain a baseUrl String');
        t.equal(client.baseUrl, 'http://localhost:8082/ag-push', 'client should have a base url property');
        t.end();
    });
});
