const DEMODB = './modules/markov_demo.txt';
const fs = require('fs');
const Markov = require('markov-strings').default
const markov = new Markov([ { string: 'Привет, мир.' } ], { stateSize: 2 });
markov.buildCorpus();

fs.readFile(DEMODB, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const result = data.toString();

  result.split('\n').map(string => ({ string })).forEach(data => markov.data.push(data));
  markov.buildCorpus();
});

module.exports = {
  name: 'markov',
  schema: {
    alias: '/markov',
    handlers: {
      learn: text => {
        if (text === undefined) {
          return 'Ошибочка! Текст укажи.';
        }

        markov.data.push({ string: text, attr: Date.now() });
        markov.buildCorpus();

        fs.appendFile(DEMODB, `\n${text}`, err => err && console.log(err));

        return 'Заебок';
      },
      gen: (options = '{ "score": 50, "length": 15 }') => markov.generate({
        maxTries: 2000, 
        prng: Math.random,
        filter: (result) => {
          const { length, score } = JSON.parse(options);
          return result.string.split(' ').length >= length - 3 && result.string.split(' ').length <= length + 3 && result.score >= score;
        }
      }).string
    }
  }
};
