'use strict';

/**
@module device-types

A convience constant that holds the value of the different Device Types
@example
  adminClient(baseUrl, settings)
    .then((client) => {
      console.log(client.DEVICE_TYPES.ANDROID) // => android
    });
*/
const deviceTypes = {
  ANDROID: 'android',
  IOS:'ios',
  SIMPLE_PUSH: 'simplePush',
  WINDOWS_WNS: 'windows_wns',
  WINDOWS_MPNS: 'windows_mpns',
  ADM: 'adm'
};

module.exports = deviceTypes;
