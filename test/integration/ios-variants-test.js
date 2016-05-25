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
 iOS Variant Tests
*/

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

test('iOS variant create with cert as a read stream - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For iOS Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'iOS Variant',
            type: 'ios',
            ios: {
                certificate: fs.createReadStream(__dirname + '/../../build/test-ios-cert.p12'),
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

test('iOS variant find all - success', (t) => {
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
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'ios'
            };
            return client.variants.find(variantToFind);
        }).then((iosVariants) => {

            t.equal(iosVariants.length, 1, 'should only return 1');
            t.equal(Array.isArray(iosVariants), true, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('iOS variant find one with variant ID - success', (t) => {
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
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'ios',
                variantId: variant.variantID
            };
            return client.variants.find(variantToFind);
        }).then((iosVariants) => {

            t.equal(iosVariants.name, 'iOS Variant', 'name should be iOS Variant');
            t.equal(iosVariants.type, 'ios', 'should be the ios type');
            t.equal(Array.isArray(iosVariants), false, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('iOS variant remove - success', (t) => {
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
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'ios',
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

test('iOS variant remove - error - wrong variantID', (t) => {
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
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'ios',
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
