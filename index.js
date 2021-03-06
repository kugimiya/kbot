const { CommandLoop } = require('./commandloop');
const prompt = require('prompt');
const Discord = require('discord.js');
const client = new Discord.Client();
const { discordToken } = require('./tokens.json');

const loop = new CommandLoop({
  modules: [
    require('./modules/markov'),
    require('./modules/utils'),
    require('./modules/help'),
  ]
});

client.on('ready', () => {
  console.log(`\nLogged in as ${client.user.tag}!`);
  prompt.start();
  ask();
});

client.on('message', msg => {
  if (msg.author.bot) {
    return;
  }

  if (loop._isCommand(msg.content)) {
    loop.emit('push', msg.content)
      .then(result => msg.reply(result))
      .catch(error => msg.reply(error.message));
  } else {
    msg.content.split('\n').forEach(line => {
      loop.emit('push', `/markov -learn ${line}`).catch(error => console.log(error))
    });
  }
});

client.login(discordToken);

function ask() {
  prompt.get(['command'], function (err, pResult) {
    if (err) { return err; }
    
    loop.emit('push', pResult.command.replace(' \n', ''))
      .then(result => console.log({ result }))
      .catch(error => console.error(error))
      .then(() => ask());
  });
}
