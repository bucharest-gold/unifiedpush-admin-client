'use strict';

const test = require('tape');
const adminClient = require('../../');

const baseUrl = 'http://localhost:8082/ag-push';
const settings = {
    username: 'admin',
    password: 'admin',
    kcUrl: 'http://localhost:8080/auth',
    kcRealmName: 'master'
};


test('iOS variant create - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For iOS Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'iOS Variant',
            type: 'ios',
            ios: {
                certificate: __dirname + '/../../build/test-ios-cert.p12',
                passphrase: 'redhat'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            t.equal(variant.name, 'iOS Variant', 'name should be iOS Variant');
            t.equal(variant.type, 'ios', 'type should be ios');
            t.equal(variant.production, false, 'production should be false');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('iOS variant create - fail on cert/passphrase miss match', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For iOS Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'iOS Variant',
            type: 'ios',
            ios: {
                certificate: __dirname + '/../../build/test-ios-cert.p12',
                passphrase: 'wrong'
            }
        };

        client.variants.create(variantOptions).catch((err) => {
            console.log(err);
            t.ok(err.certificatePassphraseValid, 'should have this error');
            t.equal(err.certificatePassphraseValid, 'the provided certificate passphrase does not match with the uploaded certificate', 'the provided certificate passphrase does not match with the uploaded certificate');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});
