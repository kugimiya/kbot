module.exports = {
  name: 'help',
  schema: {
    alias: '/help',
    handlers: {
      main: () => `Built-in modules: 'markov', 'utils'; type /help :markov OR /help :utils FOR help by this modules`,
      markov: () => `'/markov' command got two actions: ':learn ONE_STRING_OF_TEXT' and ':gen OPTIONS'\n'OPTIONS' is JSON-encoded string, default value is { "score": 50, "length": 15 }\nUsage: /markov :gen {"length":20,"score":0}`,
      utils: () => `'/utils' command got one action: ':ping'\nUsage: /utils :ping`
    }
  }
};
