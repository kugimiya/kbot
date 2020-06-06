const EventEmitter = require('events');

class CommandLoop {
  modules = {};
  aliases = {};
  emitter = null;
  commandRegExp = /\/([a-z]*)\s\:([a-z]*)\s?(.*)?/;

  constructor({ modules = [] }) {
    this.emitter = new EventEmitter();

    modules.forEach(module => {
      this.modules[module.name] = module.schema;
      this.aliases[module.schema.alias] = module.name;
    });

    this.emitter.on('push', (plainTextCommand, cb) => {
      try {
        const result = this.handlePlainTextCommand(plainTextCommand);
        cb(null, result);
      } catch (error) {
        cb(error, null);
      }
    });
  }

  emit(...args) {
    return new Promise((resolve, reject) => {
      this.emitter.emit(...args, (error, result) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  handlePlainTextCommand(command) {
    if (!this._isCommand(command)) {
      throw new Error(`Error in command: ${command} \nThis is not a command. Command scheme: '/alias :action ...args'`);
    }

    const [ alias, handler, source ] = this._splitCommand(command);
    
    if (!this._aliasExist(alias)) {
      throw new Error(`Error in command: ${command} \n/${alias} doesn't exist.`);
    }

    if (!this._handlerExist(alias, handler)) {
      throw new Error(`Error in command: ${command} \n:${handler} doesn't exist.`);
    }

    return this._handler(alias, handler)(source);
  }

  _aliasExist(alias) {
    return Object.keys(this.aliases).includes(`/${alias}`);
  }

  _handlerExist(alias, handler) {
    return Object.keys(this.modules[this._moduleName(alias)].handlers).includes(handler);
  }

  _moduleName(alias) {
    return this.aliases[`/${alias}`];
  }

  _handler(alias, handler) {
    return this.modules[this._moduleName(alias)].handlers[handler];
  }

  _isCommand(command) {
    return this.commandRegExp.test(command);
  }

  _splitCommand(command) {
    const [ origin, alias, handler, source ] = this.commandRegExp.exec(command);
    return [ alias, handler, source ];
  }
}

module.exports = { CommandLoop };