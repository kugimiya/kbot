const { CommandLoop } = require('./commandloop');
const prompt = require('prompt');

const loop = new CommandLoop({
  modules: [
    require('./modules/markov'),
    require('./modules/utils')
  ]
});

prompt.start();
ask();

function ask() {
  prompt.get(['command'], function (err, pResult) {
    if (err) { return err; }
    
    loop.emit('push', pResult.command.replace(' \n', ''))
      .then(result => console.log({ result }))
      .catch(error => console.error(error.message))
      .then(() => ask());
  });
}

// const source = 'Today you are you. That is truer than true. There is no one alive who is you-er than you. You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. You’re on your own. The more that you read, the more things you will know. The more that you learn, the more places you’ll go. Think left and think right and think low and think high. Oh, the thinks you can think up if only you try.';