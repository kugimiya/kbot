const fs = require('fs');
const Markov = require('markov-strings').default
const markov = new Markov([ { string: 'Привет, мир.' } ], { stateSize: 2 });
markov.buildCorpus();

fs.readFile('./modules/markov_demo.txt', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const result = data.toString();

  result.split('\n').map(string => ({ string })).forEach(data => markov.data.push(data));
  markov.buildCorpus();
})

module.exports = {
  name: 'markov',
  schema: {
    alias: '/markov',
    handlers: {
      learn: text => {
        markov.data.push({ string: text, attr: Date.now() });
        markov.buildCorpus();

        fs.appendFile('./modules/markov_demo.txt', `\n${text}`, err => err && console.log(err));
      },
      gen: (options = '{ "score": 50, "length": 15 }') => markov.generate({
        maxTries: 2000, 
        prng: Math.random,
        filter: (result) => {
          const { length, score } = JSON.parse(options);
          return result.string.split(' ').length >= length - 10 && result.string.split(' ').length <= length + 10 && result.score >= score;
        }
      })
    }
  }
};
