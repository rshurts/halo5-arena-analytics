import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { CarnageArena } from '../api/carnage-arena.js';

import './killerReport.js';
import './victimReport.js';
import './carnageReport.html';

Template.carnageReport.onCreated(function carnageReportOnCreated() {
  this.subscribe('CarnageArena');
});

Template.carnageReport.helpers({
  hidden() {
    if (Session.get('matchId')) {
      return 'visible';
    }
    return 'hidden';
  },
  carnageArena() {
    return CarnageArena.findOne({
      matchId: Session.get('matchId'),
      player: Session.get('player'),
    });
  },
  accuracy(fired, landed) {
    let accuracy = 0;
    if (fired !== undefined && landed !== undefined && landed !== 0) {
      accuracy = Math.trunc((fired / landed) * 100);
    }
    return accuracy;
  },
  player() {
    return Session.get('player');
  },
});

Template.carnageReport.events({
  'click .killer'(event) {
    Session.set('killer', this.GamerTag);
  },
  'click .victim'(event) {
    Session.set('victim', this.GamerTag);
  },
});
