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

test('Android variant update - success', (t) => {
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
            const variantToUpdate = {
                android: {}
            };
            variantToUpdate.pushAppId = application.pushApplicationID;
            variantToUpdate.variantId = variant.variantID;
            variantToUpdate.name = 'New Name';
            variantToUpdate.type = 'android';
            variantToUpdate.android.googleKey = '54321';
            variantToUpdate.android.projectNumber = variant.projectNumber;

            return client.variants.update(variantToUpdate);
        }).then((updatedVariant) => {
            t.equal(updatedVariant.name, 'New Name', 'name should be New Name');
            t.equal(updatedVariant.type, 'android', 'type should be android');
            t.equal(updatedVariant.googleKey, '54321', 'googleKey should be 54321');
            t.equal(updatedVariant.projectNumber, '1234567', 'projectNumber should be 1234567');

            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Android variant update - failure - missing required field', (t) => {
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
            const variantToUpdate = {
                android: {}
            };
            variantToUpdate.pushAppId = application.pushApplicationID;
            variantToUpdate.variantId = variant.variantID;
            variantToUpdate.name = 'New Name';
            variantToUpdate.type = 'android';
            variantToUpdate.android.projectNumber = variant.projectNumber;

            return client.variants.update(variantToUpdate);
        }).catch((err) => {
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

test('Android Variant remove - success', (t) => {
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
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'android',
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

test('Android Variant remove - error - wrong variantID', (t) => {
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
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'android',
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
