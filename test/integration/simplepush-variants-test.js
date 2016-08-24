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

test('SimplePush remove - success', (t) => {
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
        const variantToRemove = {
          pushAppId: application.pushApplicationID,
          type: 'simplePush',
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

test('SimplePush remove - error - wrong variantID', (t) => {
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
        const variantToRemove = {
          pushAppId: application.pushApplicationID,
          type: 'simplePush',
          variantId: 'NOT_RIGHT'
        };
        return client.variants.remove(variantToRemove);
      }).catch((error) => {
        if (error) {
          console.error(error);
        }
        // now remove the thing we created,  we will test delete later on
        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});
