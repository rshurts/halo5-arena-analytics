import { Meteor } from 'meteor/meteor';

import '../../api/weapons.js';

if (Meteor.isServer) {
  console.log('Startup: Retrieving WEAPONS');
  Meteor.call('getWeapons');
}
