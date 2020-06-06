module.exports = {
  name: 'markov',
  schema: {
    alias: '/markov',
    handlers: {
      learn: text => console.log(text)
    }
  }
};
