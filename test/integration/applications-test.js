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
          const foundApp = applications.filter( a => a.pushApplicationID === application.pushApplicationID);
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

test('create application - failure', (t) => {
    const upsClient = adminClient(baseUrl, settings);

    upsClient.then((client) => {
        client.applications.create({description: 'Cool Description'}).catch((error) => {
            t.equal(error.name, 'may not be null', 'should have an error for name beining needed');
            t.end();
        });
    });
});
