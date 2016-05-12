[![Build Status](https://travis-ci.org/bucharest-gold/unifiedpush-admin-client.svg?branch=master)](https://travis-ci.org/bucharest-gold/unifiedpush-admin-client) [![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/unifiedpush-admin-client/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/unifiedpush-admin-client?branch=master)

## Unified Push Admin Client

A client for connecting to the AeroGear UnifiedPush servers admin REST API - https://aerogear.org/docs/specs/aerogear-unifiedpush-rest/#home

## API Documentation

http://bucharest-gold.github.io/unifiedpush-admin-client/


## Example

    'use strict';

    let adminClient = require('unifiedpush-admin-client');

    let baseUrl = 'http://127.0.0.1:8080/ag-push';

    let settings = {
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

### Server Setup

At the moment, you must enable "Direct Access Grants" on the UnifiedPush Server for this to work
