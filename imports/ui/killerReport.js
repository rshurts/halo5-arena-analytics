import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

import { CarnageArena } from '../api/carnage-arena.js';
import { MatchEvents } from '../api/match-events.js';
import { Weapons } from '../api/weapons.js';

import './killerReport.html';

Template.killerReport.onCreated(function killerReportOnCreated() {
  this.subscribe('CarnageArena');
  this.subscribe('MatchEvents');
  this.subscribe('Weapons');
});

Template.killerReport.helpers({
  hidden() {
    if (Session.get('killer')) {
      return 'visible';
    }
    return 'hidden';
  },
  killerDetails() {
    return CarnageArena.findOne({
      matchId: Session.get('matchId'),
      player: Session.get('killer'),
    });
  },
  accuracy(fired, landed) {
    let accuracy = 0;
    if (fired !== undefined && landed !== undefined && landed !== 0) {
      accuracy = Math.trunc((fired / landed) * 100);
    }
    return accuracy;
  },
  weaponStats() {
    const weaponStats = [];
    const matchEvents = MatchEvents.find({
      matchId: Session.get('matchId'),
      eventName: 'Death',
      'killer.Gamertag': Session.get('killer'),
      'victim.Gamertag': Session.get('player'),
    });

    matchEvents.forEach(function (matchEvent) {
      const weaponId = matchEvent.killerWeaponStockId;
      const weaponMetaData = Weapons.findOne({
        weaponId: weaponId.toString()
      });
      if (! _.findWhere(weaponStats, { weaponId })) {
        weaponStats.push({
          weaponId,
          weaponKills: MatchEvents.find({
            matchId: Session.get('matchId'),
            eventName: 'Death',
            'killer.Gamertag': Session.get('killer'),
            'victim.Gamertag': Session.get('player'),
            killerWeaponStockId: weaponId,
          }).count(),
          weaponHeadshots: MatchEvents.find({
            matchId: Session.get('matchId'),
            eventName: 'Death',
            'killer.Gamertag': Session.get('killer'),
            'victim.Gamertag': Session.get('player'),
            killerWeaponStockId: weaponId,
            isHeadshot: true,
          }).count(),
          weaponName: weaponMetaData.name,
          weaponImageUrl: weaponMetaData.imageUrl,
        });
      }
    });
    return weaponStats;
  },
});
