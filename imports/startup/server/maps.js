import { Meteor } from 'meteor/meteor';

import '../../api/maps.js';

if (Meteor.isServer) {
  console.log('Startup: Retrieving MAPS');
  Meteor.call('getMaps');
}
