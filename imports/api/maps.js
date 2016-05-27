import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

export const Maps = new Mongo.Collection('Maps');

if (Meteor.isServer) {
  Meteor.publish('Maps', function mapsPublication() {
    return Maps.find({}, { fields: { name: 1, imageUrl: 1, mapId: 1 } });
  });
}

Meteor.methods({
  'getMaps'() {
    if (Meteor.isServer) {
      const response = HTTP.get(
        'https://www.haloapi.com/metadata/h5/metadata/maps',
        {
          headers: {
            'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
          },
          npmRequestOptions: { gzip: true },
        }
      );

      const maps = JSON.parse(response.content);

      for (let i = 0; i < maps.length; i++) {
        if (! Maps.find({ mapId: maps[i].id }).count()) {
          Maps.insert({
            name: maps[i].name,
            description: maps[i].description,
            imageUrl: maps[i].imageUrl,
            mapId: maps[i].id,
          });
        }
      }
    }
  },
});
