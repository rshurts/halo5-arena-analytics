import { Meteor } from 'meteor/meteor';

import '../../api/game-base-variants.js';

if (Meteor.isServer) {
  console.log('Startup: Retrieving GAME BASE VARIANTS');
  Meteor.call('getGameBaseVariants');
}
