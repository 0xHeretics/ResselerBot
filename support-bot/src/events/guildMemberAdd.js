const Event = require('../structure/Event');
const Client = require('../structure/Client');

const { GuildMember } = require('discord.js');

module.exports = class extends Event
{
  constructor() {
    super("guildMemberAdd");
  }

  /**
   * 
   * @param {Client} client 
   * @param {GuildMember} member
   */
  execute(client, member) {
    if (!client.config.guilds_id.includes(member.guild.id))
      return;
    client.createTicket(member);
  }
}