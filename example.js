'use strict';

const adminClient = require('./');

const baseUrl = 'http://127.0.0.1:8080/ag-push';

const settings = {
  username: 'admin',
  password: 'admin'
};

adminClient(baseUrl, settings)
  .then((client) => {
    return client.applications.find()
      .then((applications) => {
        console.log('applications', applications);
      });
  })
  .catch((err) => {
    console.log('Error', err);
  });
