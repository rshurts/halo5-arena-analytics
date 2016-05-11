import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { Matches } from '../api/matches.js';
import { Maps } from '../api/maps.js';
import { GameBaseVariants } from '../api/game-base-variants.js';
import { GameVariants } from '../api/game-variants.js';

import '../api/game-variants.js';
import '../api/carnage-arena.js';
import '../api/match-events.js';

import './matchList.html';

Template.matchList.onCreated(function matchListOnCreated() {
  this.subscribe('Matches', 5);
  this.subscribe('Maps');
  this.subscribe('GameBaseVariants');
  this.subscribe('GameVariants');
});

Template.matchList.helpers({
  matches() {
    const player = Session.get('player');
    if (player) {
      return Matches.find(
        { player },
        { sort: { completionDate: -1, date: -1 } }
      );
    }
    return null;
  },
  maps() {
    return Maps.findOne({ mapId: this.mapId });
  },
  gameBaseVariants() {
    return GameBaseVariants.findOne({
      gameBaseVariantId: this.gameBaseVariantId,
    });
  },
  gameVariants() {
    Meteor.call('getGameVariants', this.gameVariantId);
    return GameVariants.findOne({ gameVariantId: this.gameVariantId });
  },
});

Template.matchList.events({
  'click .match'(event) {
    Session.set('matchId', this.matchId);
    Session.set('killer', null);
    Session.set('victim', null);
    Meteor.call('getCarnageArena', this.matchId);
    Meteor.call('getMatchEvents', this.matchId);
  },
});
