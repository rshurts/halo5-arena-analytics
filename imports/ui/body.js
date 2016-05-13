import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import './helpers.js';
import './matchList.js';
import './carnageReport.js';
import './body.html';

Template.body.events({
  'submit .gamertag'(event) {
    event.preventDefault();

    const target = event.target;
    const player = target.player.value;

    Session.set('player', player);
    Session.set('matchId', null);
    Session.set('killer', null);
    Session.set('victim', null);

    Meteor.call('getMatchesForPlayer', player);

    target.player.value = '';
  },
});
