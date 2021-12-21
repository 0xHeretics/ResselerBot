const Event = require('../structure/Event');
const Client = require('../structure/Client');

module.exports = class extends Event
{
  constructor() {
    super("ready");
  }

  /**
   * 
   * @param {Client} client 
   */
  execute(client) {
    console.log("[ Client ] Bot prêt.")
  }
}