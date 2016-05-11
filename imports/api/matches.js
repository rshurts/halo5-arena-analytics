import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

export const Matches = new Mongo.Collection('Matches');

if (Meteor.isServer) {
  Meteor.publish('Matches', function matchesPublication(limit) {
    return Matches.find({}, { sort: { completionDate: -1, date: -1 }, limit });
  });
}

Meteor.methods({
  'getMatchesForPlayer'(player) {
    check(player, String);
    if (Meteor.isServer && player !== '') {
      console.log('Getting MATCHES for player', player);
      const response = HTTP.get(
        'https://www.haloapi.com/stats/h5/players/' + player + '/matches?',
        {
          params: { modes: 'arena', count: '5' },
          headers: {
            'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
          },
        }
      );
      const matches = response.data.Results;

      // Store the results in the database
      // unless the player and matchId already exists
      for (let i = 0; i < matches.length; i++) {
        if (! Matches.find({
          player,
          matchId: matches[i].Id.MatchId,
        }).count()) {
          Matches.insert({
            player,
            matchId: matches[i].Id.MatchId,
            mapId: matches[i].MapId,
            gameBaseVariantId: matches[i].GameBaseVariantId,
            gameVariantId: matches[i].GameVariant.ResourceId,
            completionDate: matches[i].MatchCompletedDate.ISO8601Date,
            date: new Date(),
          });
        }
      }
    }
  },
});
