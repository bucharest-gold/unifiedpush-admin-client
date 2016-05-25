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

/**
 Android Variant Tests
*/
test('Android variant create - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Android Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Android Variant',
            type: 'android',
            android: {
                googleKey: 'abcd-1234',
                'projectNumber': '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            t.equal(variant.name, 'Android Variant', 'name should be Android Variant');
            t.equal(variant.type, 'android', 'type should be android');
            t.equal(variant.googleKey, 'abcd-1234', 'googleKey should be abcd-1234');
            t.equal(variant.projectNumber, '1234567', 'projectNumber should be 1234567');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});


test('Android variant create - fail on missing googleKey', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Android Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Android Variant',
            type: 'android',
            android: {
                'projectNumber': '1234567'
            }
        };

        client.variants.create(variantOptions).catch((err) => {
            t.ok(err.googleKey, 'should have this error');
            t.equal(err.googleKey, 'may not be null', 'may not be null');

            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Android Variant find all - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Android Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Android Variant',
            type: 'android',
            android: {
                googleKey: 'abcd-1234',
                'projectNumber': '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'android'
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

test('Android Variant find one with variant ID - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Android Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Android Variant',
            type: 'android',
            android: {
                googleKey: 'abcd-1234',
                'projectNumber': '1234567'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'android',
                variantId: variant.variantID
            };
            return client.variants.find(variantToFind);
        }).then((androidVariant) => {

            t.equal(androidVariant.name, 'Android Variant', 'name should be iOS Variant');
            t.equal(androidVariant.type, 'android', 'should be the android type');
            t.equal(Array.isArray(androidVariant), false, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

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

/**
 SimplePush Variant Tests
*/
test('SimplePush variant create - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For SimplePush Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'SimplePush Variant',
            type: 'simplePush'
        };

        client.variants.create(variantOptions).then((variant) => {
            t.equal(variant.name, 'SimplePush Variant', 'name should be SimplePush Variantt');
            t.equal(variant.type, 'simplePush', 'type should be simplePush');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('SimplePush find all - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For SimplePush'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'SimplePush',
            type: 'simplePush'
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'simplePush'
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

test('SimplePush find one with variant ID - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For SimplePush'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'SimplePush',
            type: 'simplePush'
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'simplePush',
                variantId: variant.variantID
            };
            return client.variants.find(variantToFind);
        }).then((simplePushVariant) => {

            t.equal(simplePushVariant.name, 'SimplePush', 'name should be iOS Variant');
            t.equal(simplePushVariant.type, 'simplePush', 'should be the simplePush type');
            t.equal(Array.isArray(simplePushVariant), false, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});
