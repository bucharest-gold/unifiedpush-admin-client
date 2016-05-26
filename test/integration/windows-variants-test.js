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
 Windows Variant Tests
*/
test('Windows Variant create - wns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            t.equal(variant.name, 'Windows Variant', 'name should be Windows Variant');
            t.equal(variant.type, 'windows_wns', 'type should be windows');
            t.equal(variant.protocolType, 'wns', 'type should be windows');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant create - mpns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'mpns'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            t.equal(variant.name, 'Windows Variant', 'name should be Windows Variant');
            t.equal(variant.type, 'windows_mpns', 'type should be windows');
            t.equal(variant.protocolType, 'mpns', 'type should be windows');
        }).then(() => {
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant create - wns - fail on missing clientSecret', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345'
            }
        };

        client.variants.create(variantOptions).catch((err) => {
            t.ok(err.clientSecret, 'should have this error');
            t.equal(err.clientSecret, 'may not be null', 'may not be null');

            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant update - wns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToUpdate = {
                windows: {}
            };
            variantToUpdate.pushAppId = application.pushApplicationID;
            variantToUpdate.variantId = variant.variantID;
            variantToUpdate.name = 'New Name';
            variantToUpdate.type = 'windows';
            variantToUpdate.windows.protocolType = variant.protocolType;
            variantToUpdate.windows.clientSecret = 'new Secret';
            variantToUpdate.windows.sid = variant.sid;

            return client.variants.update(variantToUpdate);
        }).then((updatedVariant) => {
            t.equal(updatedVariant.name, 'New Name', 'name should be New Name');
            t.equal(updatedVariant.clientSecret, 'new Secret', 'clientSecret should be updated');

            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant update - mpns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'mpns'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToUpdate = {
                windows: {}
            };
            variantToUpdate.pushAppId = application.pushApplicationID;
            variantToUpdate.variantId = variant.variantID;
            variantToUpdate.name = 'New Name';
            variantToUpdate.type = 'windows';
            variantToUpdate.windows.protocolType = variant.protocolType;

            return client.variants.update(variantToUpdate);
        }).then((updatedVariant) => {
            t.equal(updatedVariant.name, 'New Name', 'name should be New Name');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant update - wns - failure with missing field', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToUpdate = {
                windows: {}
            };
            variantToUpdate.pushAppId = application.pushApplicationID;
            variantToUpdate.variantId = variant.variantID;
            variantToUpdate.name = 'New Name';
            variantToUpdate.type = 'windows';
            variantToUpdate.windows.protocolType = variant.protocolType;
            variantToUpdate.windows.sid = variant.sid;

            return client.variants.update(variantToUpdate);
        }).catch((error) => {
            t.ok(error.clientSecret, 'should have this error');
            t.equal(error.clientSecret, 'may not be null', 'may not be null');

            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});


// I believe there to be a bug here:  https://issues.jboss.org/browse/AGPUSH-1631
test.skip('Windows Variant find all - wns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocolType: 'wns'
                }
            };
            return client.variants.find(variantToFind);
        }).then((windowsWNSVariant) => {
            t.equal(windowsWNSVariant.length, 1, 'should only return 1');
            t.equal(Array.isArray(windowsWNSVariant), true, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant find one with variant ID - wns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocolType: 'wns'
                },
                variantId: variant.variantID
            };
            return client.variants.find(variantToFind);
        }).then((windowsWNSVariant) => {
            t.equal(windowsWNSVariant.name, 'Windows Variant', 'name should be Windows Variant');
            t.equal(windowsWNSVariant.type, 'windows_wns', 'should be the windows_wns type');
            t.equal(Array.isArray(windowsWNSVariant), false, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant find one with variant ID - mpns - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'mpns'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToFind = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocolType: 'mpns'
                },
                variantId: variant.variantID
            };
            return client.variants.find(variantToFind);
        }).then((windowsWNSVariant) => {
            t.equal(windowsWNSVariant.name, 'Windows Variant', 'name should be Windows Variant');
            t.equal(windowsWNSVariant.type, 'windows_mpns', 'should be the windows_wns type');
            t.equal(Array.isArray(windowsWNSVariant), false, 'the return value should be an array');
            // now remove the thing we created,  we will test delete later on
            client.applications.remove(application.pushApplicationID);
            t.end();
        });
      });
    });
});

test('Windows Variant remove - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocalType: 'wns',
                },
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

test('Windows Variant remove - failure', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windows Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windows Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToRemove = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocalType: 'wns',
                },
                variantId: 'fake'
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

test('Windws Variant Reset Secret - success', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windws Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windws Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToReset = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocolType: 'wns'
                },
                variantId: variant.variantID
            };
            return client.variants.reset(variantToReset).then((updatedVariant) => {
                t.notEqual(updatedVariant.secret, variant.secret, 'secrets should be different');
                // now remove the thing we created,  we will test delete later on
                client.applications.remove(application.pushApplicationID);
                t.end();
            });
        });
      });
    });
});

test('Windws Variant Reset Secret - failure', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
    // First we need to create an application to add a variant to
    client.applications.create({name: 'For Windws Variant'}).then((application) => {
        const variantOptions = {
            pushAppId: application.pushApplicationID,
            name: 'Windws Variant',
            type: 'windows',
            windows: {
                protocolType: 'wns',
                sid: '12345',
                clientSecret: 'secret'
            }
        };

        client.variants.create(variantOptions).then((variant) => {
            const variantToReset = {
                pushAppId: application.pushApplicationID,
                type: 'windows',
                windows: {
                    protocolType: 'wns'
                },
                variantId: 'wrong_id'
            };
            return client.variants.reset(variantToReset).catch((error) => {
                // now remove the thing we created,  we will test delete later on
                client.applications.remove(application.pushApplicationID);
                t.end();
            });
        });
      });
    });
});
