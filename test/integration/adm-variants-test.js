'use strict';

const test = require('tape');
const fs = require('fs');
const adminClient = require('../../');

const baseUrl = 'http://localhost:8082/ag-push';
const settings = {
    username: 'admin',
    password: 'admin',
    kcUrl: 'http://localhost:8080/auth',
    kcRealmName: 'master'
};

/**
 ADM Variant Tests
*/
test('ADM variant create - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For ADM Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'ADM Variant',
            type: 'adm',
            adm: {
                clientId: 'abcd-1234',
                clientSecret: '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            t.equal(variant.name, 'ADM Variant', 'name should be ADM Variant');
            t.equal(variant.type, 'adm', 'type should be adm');
            t.equal(variant.clientId, 'abcd-1234', 'clientId should be abcd-1234');
            t.equal(variant.clientSecret, '1234567', 'clientSecret should be 1234567');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('ADM variant create - failure', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For ADM Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'ADM Variant',
            type: 'adm',
            adm: {
            }
        };

        client.variants.create(variantOptions).catch((err) => {
            t.ok(err.clientId, 'should have this error');
            t.equal(err.clientId, 'may not be null', 'may not be null');

            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('ADM Variant find all - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For ADM Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'ADM Variant',
            type: 'adm',
            adm: {
                clientId: 'abcd-1234',
                clientSecret: '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'adm'
            };
            return client.variants.find(variantToFind);
        }).then((anrdoidVariant) => {

            t.equal(anrdoidVariant.length, 1, 'should only return 1');
            t.equal(Array.isArray(anrdoidVariant), true, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('ADM Variant find one with variant ID - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For ADM Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'ADM Variant',
            type: 'adm',
            adm: {
                clientId: 'abcd-1234',
                clientSecret: '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'adm',
                variantId: variant.variantID
            };
            return client.variants.find(variantToFind);
        }).then((admVariant) => {

            t.equal(admVariant.name, 'ADM Variant', 'name should be iOS Variant');
            t.equal(admVariant.type, 'adm', 'should be the adm type');
            t.equal(Array.isArray(admVariant), false, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('ADM Variant remove - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For ADM Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'ADM Variant',
            type: 'adm',
            adm: {
                clientId: 'abcd-1234',
                clientSecret: '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'adm',
                variantId: variant.variantID
            };
            return client.variants.remove(variantToRemove);
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('ADM Variant remove - error - wrong variantID', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For ADM Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'ADM Variant',
            type: 'adm',
            adm: {
                clientId: 'abcd-1234',
                clientSecret: '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'adm',
                variantId: 'NOT_RIGHT'
            };
            return client.variants.remove(variantToRemove);
        }).catch((err) => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});
