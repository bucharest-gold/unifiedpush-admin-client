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

test('test successful find of applications', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    // First we need to create an application, we will test create later on

    client.applications.create({name: 'First One'}).then((application) => {
      // If successful, the server returns a 200 with an array of push applications
      client.applications.find().then((applications) => {
        const foundApp = applications.filter(a => a.pushApplicationID === application.pushApplicationID);
        t.equal(foundApp.length, 1, 'the thing we are looking for should be in the list of applications');
        t.equal(Array.isArray(applications), true, 'should be an array returned when finding all');
      }).then(() => {
        // now remove the thing we created,  we will test delete later on
        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});

test('test successful find 1 application', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    // First we need to create an application, we will test create later on

    client.applications.create({name: 'Second One'}).then((application) => {
      // If successful, the server returns a 200 with an array of push applications
      client.applications.find(application.pushApplicationID).then((application) => {
        t.equal(application.name, 'Second One', 'name should be Second One');
        t.equal(Array.isArray(application.variants), true, 'should be a variant object/array');
        t.equal(Array.isArray(application), false, 'should not be an array returned when finding just one');
      }).then(() => {
        // now remove the thing we created,  we will test delete later on
        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});

test('create application - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Create', description: 'Cool Description'}).then((application) => {
      t.equal(application.name, 'Test Create', 'name should be Second One');
      t.equal(application.description, 'Cool Description', 'description should be Cool Description');

      return application;
    }).then((application) => {
      // now remove the thing we created,  we will test delete later on
      client.applications.remove(application.pushApplicationID);
      t.end();
    });
  });
});

test('create application - failure - missing name field', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({description: 'Cool Description'}).catch((error) => {
      t.equal(error.name, 'may not be null', 'should have an error for name beining needed');
      t.end();
    });
  });
});

test('update application - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Update', description: 'Cool Description'}).then((application) => {
      application.name = 'Been Updated';
      application.description = 'Updated Description';
      return client.applications.update(application).then(() => {
        // Push Applications update doesn't return anything for an update
        t.pass();

        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});

test('update application - failure - no name in the updated value', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Update 2'}).then((application) => {
      delete application.name;
      application.description = 'Updated Description';
      return client.applications.update(application).catch((error) => {
        t.equal(error.name, 'may not be null', 'should have an error for name beining needed');

        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});

test('update application - failure - no pushApplicationId in the updated value', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Update 2'}).then((application) => {
      delete application.pushApplicationID;
      application.description = 'Updated Description';
      return client.applications.update(application).catch((error) => {
        t.equal(error, 'Could not find requested PushApplicationEntity', 'pushApplicationID needed');

        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});

test('remove application - sucess', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Delete 1'}).then((application) => {
      return client.applications.remove(application.pushApplicationID).then(() => {
        t.end();
      });
    });
  });
});

test('remove application - failure - wrong pushApplicationID', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Delete 2'}).then((application) => {
      const pushAppId = application.pushApplicationID;
      delete application.pushApplicationID;
      return client.applications.remove(application.pushApplicationID).catch((error) => {
        t.equal(error, 'Could not find requested PushApplicationEntity', 'pushApplicationID needed');

        // clean up
        client.applications.remove(pushAppId);
        t.end();
      });
    });
  });
});

test('reset application secret - sucess', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Secret 1'}).then((application) => {
      return client.applications.reset(application.pushApplicationID).then((updatedSecret) => {
        t.notEqual(application.masterSecret, updatedSecret.masterSecret, 'master secrets should be different');

        // clean up
        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});

test('reset application secret - failure - wrong pushApplicationID', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    client.applications.create({name: 'Test Secret 1'}).then((application) => {
      return client.applications.reset('NOT_THE_REAL_ID').catch((err) => {
        t.equal(err, 'Could not find requested PushApplicationEntity', 'should error');
        // clean up
        client.applications.remove(application.pushApplicationID);
        t.end();
      });
    });
  });
});
