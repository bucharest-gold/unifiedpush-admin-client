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


## Variants

The 0.2.0 release brings in the methods to interact with the Variants.  To learn more about what exactly a variant is in terms of the Unified Push Server, checkout their docs here:  https://aerogear.org/docs/unifiedpush/ups_userguide/index/#_useful_terminology

The `find` method for variants is similiar to the `find` method for applications. The difference is that you need to specify a `type` along with the `pushAppId`

Example of Find all Variants for Type for a Push Application(_note: we are only showing a snippet of code here. assume we have the client object already_)

    const variantOptions = {
      pushAppId: 'PUSH_APPLICATION_ID',
      type: 'android'
    };


    client.variants.find(variantOptions).then((variants) => {
      console.log(variants); // will show the list of android variants
    });


For the available Device Types, there is a constant called `client.DEVICE_TYPES` for convience,  https://github.com/bucharest-gold/unifiedpush-admin-client/blob/master/lib/device-types.js


Create example:

    const variantOptions = {
      pushAppId: 'PUSH_APPLICATION_ID',
      name: 'My Cool App',
      type: 'android',
      android: {
        googleKey: 'SOME_GOOGLE_API_KEY',
        projectNumber: 'SOME_GOOGLE_PROJECT_NUMBER'
      }
    };

    client.variants.create(variantOptions).then((variant) => {
      console.log(variant); // will be the created variant with some extra meta-data added
    });

This above example specifies the `type` as `android`, so we therefore must have an anrdoid object with the specific thing an android variant needs.

If the type was `adm` for Amazom push, then we would need an adm object with those specific options

As of 0.2.0, only Android is documented and tested.

Future releases will add the other Device Types

### Server Setup

At the moment, you must enable "Direct Access Grants" on the UnifiedPush Server for this to work
