'use strict';

const test = require('tape');
const fs = require('fs');
const adminClient = require('../../');

const registrationClient = require('unifiedpush-registration-client');
const devicesForImporting = require(__dirname + '/../../build/importer-test.json');

const baseUrl = 'http://localhost:8082/ag-push';
const settings = {
    username: 'admin',
    password: 'admin',
    kcUrl: 'http://localhost:8080/auth',
    kcRealmName: 'master'
};

const bootstrapAndroidVariant = (client) => {
    const androidVariantProject = {
        pushApplicationName: 'Bootstrap 1',
        androidVariantName: 'Android Name',
        androidGoogleKey: '12345',
        androidProjectNumber: '54321'
    };

    return client.applications.bootstrap(androidVariantProject);
};

const addAndroidInstallation = (settings, devices) => {
    return registrationClient(baseUrl).then((client) => {
        return client.registry.importer(settings, devices);
    });
};

const doBootstrapping = () => {
    return adminClient(baseUrl, settings).then((client)  => {
        return bootstrapAndroidVariant(client).then((pushApplication) => {
            const settings = {
                variantId: pushApplication.variants[0].variantID,
                secret: pushApplication.variants[0].secret
            };

            return addAndroidInstallation(settings, devicesForImporting).then(() => {
                return client.applications.find(pushApplication.pushApplicationID);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
};


test('find installations - success', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                t.equal(Array.isArray(installations), true, 'returned installations should be an array');
                t.equal(installations.length, devicesForImporting.length, 'should have the same length as the things we entered in');
            }).then(() => {
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});


test('find installations - fail', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: 'NOT_FOUND'}).catch((err) => {
                t.pass('should be in the catch');
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});

test('find installations - just one installation - success', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                return client.installations.find({variantId: pushApplication.variants[0].variantID, installationId: installations[0].id}).then((installation) => {
                    t.equal(Array.isArray(installation), false, 'returned installations should not be an array');
                    t.equal(installation.id, installations[0].id, 'should be the same');
                    return;
                });
            }).then(() => {
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});

test('find installations - just one installation - fail', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                return client.installations.find({variantId: pushApplication.variants[0].variantID, installationId: 'WRONG'});
            }).catch((err) => {
                t.pass('should be in the catch');
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});

test('remove installation - success', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                return client.installations.remove({variantId: pushApplication.variants[0].variantID, installationId: installations[0].id}).then(() => {
                    t.pass('should succeed');
                    return;
                });
            }).then(() => {
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});

test('remove installation - fail', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                return client.installations.remove({variantId: pushApplication.variants[0].variantID, installationId: 'WRONG_ID'}).catch(() => {
                    t.pass('should be in the catch');
                    t.end();
                    return client.applications.remove(pushApplication.pushApplicationID);
                });
            });
        });
    });
});

test('update installation - success', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                const options = {
                    variantId: pushApplication.variants[0].variantID,
                    installation: installations[0]
                };

                options.installation.alias = 'NEW Alias';

                return client.installations.update(options).then((updateInstallation) => {
                    t.pass('should succeed, returns no content');
                    return client.installations.find({variantId: pushApplication.variants[0].variantID, installationId: installations[0].id});
                });
            }).then((installation) => {
                t.equal(installation.alias, 'NEW Alias', 'update alias should be there');
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});

test('update installation - fail', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.find({variantId: pushApplication.variants[0].variantID}).then((installations) => {
                const options = {
                    variantId: pushApplication.variants[0].variantID,
                    installation: installations[0]
                };

                options.installation.alias = 'NEW Alias';
                options.installation.id = 'NOPE';

                return client.installations.update(options).catch((err) => {
                    t.pass('should error in the catch');
                    t.end();
                    return client.applications.remove(pushApplication.pushApplicationID);
                });
            });
        });
    });
});

test('export installations - success', (t) => {
    // First setup the project and variant we need
    doBootstrapping().then((pushApplication) => {
        return adminClient(baseUrl, settings).then((client) => {
            return client.installations.exporter(pushApplication.variants[0].variantID).then((installations) => {
                t.equal(Array.isArray(installations), true, 'returned installations should be an array');
                t.equal(installations.length, devicesForImporting.length, 'should have the same length as the things we entered in');
            }).then(() => {
                t.end();
                return client.applications.remove(pushApplication.pushApplicationID);
            });
        });
    });
});
