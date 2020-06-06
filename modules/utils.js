module.exports = {
  name: 'utils',
  schema: {
    alias: '/utils',
    handlers: {
      ping: () => 'Pong!',
      halt: () => process.exit(0)
    }
  }
};
