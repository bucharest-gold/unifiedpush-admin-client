'use strict';

const test = require('tape');
const path = require('path');
const adminClient = require('../../');

const baseUrl = 'http://localhost:8082/ag-push';
const settings = {
  username: 'admin',
  password: 'admin',
  kcUrl: 'http://localhost:8080/auth',
  kcRealmName: 'master'
};

test('test application bootstrap - with just android - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      androidVariantName: 'Android Name',
      androidGoogleKey: '12345',
      androidProjectNumber: '54321'
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 1, 'should only be 1 variant');
      t.equal(app.variants[0].name, bootstrapper.androidVariantName, 'variant name should the variant name');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});

test('test application bootstrap - with just android - failure - missing googleKey', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      androidVariantName: 'Android Name',
      androidProjectNumber: '54321'
    };

    client.applications.bootstrap(bootstrapper).catch((err) => {
      t.ok(err.androidValid, 'should have an androidValid error');
      t.equal(err.androidValid, 'invalid android data', 'should have the error message');
      t.end();
    });
  });
});

test('test application bootstrap - with just ios - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      iosVariantName: 'iOS Name',
      iosPassphrase: 'redhat',
      iosCertificate: path.join(__dirname, '/../../build/test-ios-cert.p12')
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 1, 'should only be 1 variant');
      t.equal(app.variants[0].name, bootstrapper.iosVariantName, 'variant name should the variant name');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});

test('test application bootstrap - with just simplePush - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      simplePushVariantName: 'SimplePush Name'
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 1, 'should only be 1 variant');
      t.equal(app.variants[0].name, bootstrapper.simplePushVariantName, 'variant name should the variant name');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});

test('test application bootstrap - with just adm - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      admVariantName: 'ADM Name',
      admClientId: '12345',
      admClientSecret: 'secret'
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 1, 'should only be 1 variant');
      t.equal(app.variants[0].name, bootstrapper.admVariantName, 'variant name should the variant name');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});

test('test application bootstrap - with just windows wns - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      windowsVariantName: 'Windows Name',
      windowsType: 'wns',
      windowsSid: '12345',
      windowsClientSecret: 'secret'
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 1, 'should only be 1 variant');
      t.equal(app.variants[0].name, bootstrapper.windowsVariantName, 'variant name should the variant name');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});

test('test application bootstrap - with just windows mpns - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap 1',
      windowsVariantName: 'Windows Name',
      windowsType: 'mpns'
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 1, 'should only be 1 variant');
      t.equal(app.variants[0].name, bootstrapper.windowsVariantName, 'variant name should the variant name');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});

test('test application bootstrap - with all variants - success', (t) => {
  const upsClient = adminClient(baseUrl, settings);

  upsClient.then((client) => {
    const bootstrapper = {
      pushApplicationName: 'Boostrap All',
      androidVariantName: 'Android Name',
      androidGoogleKey: '12345',
      androidProjectNumber: '54321',
      iosVariantName: 'iOS Name',
      iosPassphrase: 'redhat',
      iosCertificate: path.join(__dirname, '/../../build/test-ios-cert.p12'),
      simplePushVariantName: 'SimplePush Name',
      windowsVariantName: 'Windows Name',
      windowsType: 'wns',
      windowsSid: '12345',
      windowsClientSecret: 'secret',
      admVariantName: 'ADM Name',
      admClientId: '12345',
      admClientSecret: 'secret'
    };

    client.applications.bootstrap(bootstrapper).then((app) => {
      t.equal(app.name, bootstrapper.pushApplicationName, 'names should be the same');
      t.equal(app.variants.length, 5, 'should be 5 variants');
      client.applications.remove(app.pushApplicationID);
      t.end();
    });
  });
});
