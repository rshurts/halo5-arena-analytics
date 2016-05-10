import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

export const Weapons = new Mongo.Collection('Weapons');

if (Meteor.isServer) {
  Meteor.publish('Weapons', function weaponsPublication() {
    return Weapons.find({});
  });
}

Meteor.methods({
  'getWeapons'() {
    if (Meteor.isServer) {
      const response = HTTP.get(
        'https://www.haloapi.com/metadata/h5/metadata/weapons',
        {
          headers: {
            'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
          },
          npmRequestOptions: { gzip: true },
        }
      );

      const weapons = JSON.parse(response.content);

      for (let i = 0; i < weapons.length; i++) {
        if (! Weapons.find({ weaponId: weapons[i].id }).count()) {
          Weapons.insert({
            name: weapons[i].name,
            description: weapons[i].description,
            imageUrl: weapons[i].largeIconImageUrl,
            weaponId: weapons[i].id,
          });
        }
      }
    }
  },
});
