import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { CarnageArena } from '../api/carnage-arena.js';

import './helpers.js';
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
  selectedKiller() {
    if (this.GamerTag === Session.get('killer')) {
      return 'success';
    }
    return null;
  },
  selectedVictim() {
    console.log(this.victim);
    if (this.GamerTag === Session.get('victim')) {
      return 'success';
    }
    return null;
  },
});

Template.carnageReport.events({
  'click .killer'() {
    Session.set('killer', this.GamerTag);
  },
  'click .victim'() {
    Session.set('victim', this.GamerTag);
  },
});
