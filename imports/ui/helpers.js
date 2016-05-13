import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';

Template.registerHelper('accuracy', (fired, landed) => {
  let accuracy = 0;
  if (fired !== undefined && landed !== undefined && landed !== 0) {
    accuracy = Math.trunc((fired / landed) * 100);
  }
  return accuracy;
});

Template.registerHelper('KDA', (kills, assists, deaths) => {
  return (Math.trunc((kills + (assists / 3) - deaths) * 10) / 10).toFixed(1);
});

Template.registerHelper('player', () => {
  return Session.get('player');
});
