const Event = require('../structure/Event');
const Client = require('../structure/Client');

const { Interaction } = require('discord.js');

module.exports = class extends Event
{
  constructor() {
    super("interactionCreate");
  }

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction
   */
  execute(client, interaction) {
    if (!client.config.guilds_id.includes(interaction.guild.id))
      return;
    if(interaction.isCommand()) {
      let index = client.commands.map(({options}) => options.name).indexOf(interaction.commandName);
      if(index === -1) return;

      let cmd = client.commands[index];
      cmd.execute(client, interaction);
    }
  }
}