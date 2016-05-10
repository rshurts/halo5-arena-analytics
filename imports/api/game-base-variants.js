import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

export const GameBaseVariants = new Mongo.Collection('GameBaseVariants');

if (Meteor.isServer) {
  Meteor.publish('GameBaseVariants', function gameBaseVariantsPublication() {
    return GameBaseVariants.find({});
  });
}

Meteor.methods({
  'getGameBaseVariants'() {
    if (Meteor.isServer) {
      const response = HTTP.get(
        'https://www.haloapi.com/metadata/h5/metadata/game-base-variants',
        {
          headers: {
            'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
          },
          npmRequestOptions: { gzip: true },
        }
      );

      const variants = JSON.parse(response.content);

      for (let i = 0; i < variants.length; i++) {
        if (! GameBaseVariants.find({ variantId: variants[i].id }).count()) {
          GameBaseVariants.insert({
            name: variants[i].name,
            iconUrl: variants[i].iconUrl,
            gameBaseVariantId: variants[i].id,
          });
        }
      }
    }
  },
});
