import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

export const MatchEvents = new Mongo.Collection('MatchEvents');

if (Meteor.isServer) {
  Meteor.publish('MatchEvents', function matchPublication() {
    return MatchEvents.find();
  });
}

Meteor.methods({
  'getMatchEvents'(matchId) {
    check(matchId, String);
    // Check to see if the matchId exists in Mongo, if not query the API
    if (! MatchEvents.find({ matchId }).count()) {
      if (Meteor.isServer) {
        console.log('Getting MATCH EVENTS for', matchId);
        const response = HTTP.get(
          'https://www.haloapi.com/stats/h5/matches/' + matchId + '/events',
          {
            headers: {
              'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
            },
          }
        );
        const match = JSON.parse(response.content).GameEvents;

        // Store the resutls in the database
        for (let i = 0; i < match.length; i++) {
          MatchEvents.insert({
            matchId,
            assistants: match[i].Assistants,
            deathDisposition: match[i].DeathDisposition,
            isAssassination: match[i].IsAssassination,
            isGroundPound: match[i].IsGroundPound,
            isHeadshot: match[i].IsHeadshot,
            isMelee: match[i].isMelee,
            isShoulderBash: match[i].IsShoulderBash,
            isWeapon: match[i].IsWeapon,
            killer: match[i].Killer,
            killerAgent: match[i].KillerAgent,
            killerWeaponAttachmentIds: match[i].KillerWeaponAttachmentIds,
            killerWeaponStockId: match[i].KillerWeaponStockId,
            killerWorldLocation: match[i].KillerWorldLocation,
            victim: match[i].Victim,
            victimAgent: match[i].VictimAgent,
            victimAttachmentIds: match[i].VictimAttachmentIds,
            victimStockId: match[i].VictimStockId,
            victimWorldLocation: match[i].VictimWorldLocation,
            eventName: match[i].EventName,
            timeSinceStart: match[i].TimeSinceStart,
          });
        }
      }
    }
  },
});
