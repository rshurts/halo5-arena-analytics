import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

export const GameVariants = new Mongo.Collection('GameVariants');

if (Meteor.isServer) {
  Meteor.publish('GameVariants', function gameVariantsPublication() {
    return GameVariants.find({}, { fields: {
      name: 1,
      iconUrl: 1,
      gameVariantId: 1,
    } });
  });
}

Meteor.methods({
  'getGameVariants'(gameVariantId) {
    check(gameVariantId, String);
    // Check to see if the gameVariantId exists in Mongo, if not query the API
    if (! GameVariants.find({ gameVariantId }).count()) {
      if (Meteor.isServer) {
        console.log('Getting GAME VARIANTS for', gameVariantId);
        const response = HTTP.get(
          'https://www.haloapi.com/metadata/h5/metadata/game-variants/' + gameVariantId,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
            },
            npmRequestOptions: { gzip: true },
          }
        );

        const variant = JSON.parse(response.content);

        GameVariants.insert({
          name: variant.name,
          iconUrl: variant.iconUrl,
          gameVariantId: variant.id,
        });
      }
    }
  },
});
