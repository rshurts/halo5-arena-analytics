import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

export const CarnageArena = new Mongo.Collection('CarnageArena');

if (Meteor.isServer) {
  Meteor.publish('CarnageArena', function carnageArenaPublication() {
    return CarnageArena.find({}, { fields: {
      matchId: 1,
      player: 1,
      totalKills: 1,
      totalAssists: 1,
      totalDeaths: 1,
      totalShotsLanded: 1,
      totalShotsFired: 1,
      totalPowerWeaponGrabs: 1,
      killedOpponentDetails: 1,
      killedByOpponentDetails: 1,
    } });
  });
}

Meteor.methods({
  'getCarnageArena'(matchId) {
    check(matchId, String);
    // Check to see if the matchId exists in Mongo, if not query the API
    if (! CarnageArena.find({ matchId }).count()) {
      if (Meteor.isServer) {
        console.log('Getting CARNAGE REPORT (ARENA) for', matchId);
        const response = HTTP.get(
          'https://www.haloapi.com/stats/h5/arena/matches/' + matchId,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': Meteor.settings.halo5APIKey,
            },
          }
        );
        const carnage = JSON.parse(response.content).PlayerStats;

        // Store the results in the database
        for (let i = 0; i < carnage.length; i++) {
          CarnageArena.insert({
            matchId,
            player: carnage[i].Player.Gamertag,
            dnf: carnage[i].DNF,
            rank: carnage[i].rank,
            teamId: carnage[i].TeamId,
            killedOpponentDetails: carnage[i].KilledOpponentDetails,
            killedByOpponentDetails: carnage[i].KilledByOpponentDetails,
            destroyedEnemyVehicles: carnage[i].DestroyedEnemyVehicles,
            weaponStats: carnage[i].WeaponStats,
            weaponWithMostKills: carnage[i].weaponWithMostKills,
            medalAwards: carnage[i].MedalAwards,
            score: carnage[i].PlayerScore,
            totalKills: carnage[i].TotalKills,
            totalSpartanKills: carnage[i].TotalSpartanKills,
            totalAssists: carnage[i].TotalAssists,
            totalDeaths: carnage[i].TotalDeaths,
            totalShotsFired: carnage[i].TotalShotsFired,
            totalShotsLanded: carnage[i].TotalShotsLanded,
            totalHeadshots: carnage[i].TotalHeadshots,
            totalMeleeKills: carnage[i].TotalMeleeKills,
            totalAssassinations: carnage[i].TotalAssassinations,
            totalGroundPoundKills: carnage[i].TotalGroundPoundKills,
            totalShoulderBashKills: carnage[i].TotalShoulderBashKills,
            totalGrenadeKills: carnage[i].TotalGrenageKills,
            totalPowerWeaponKills: carnage[i].TotalPowerWeaponKills,
            totalPowerWeaponGrabs: carnage[i].TotalPowerWeaponGrabs,
          });
        }
      }
    }
  },
});
