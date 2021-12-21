const config = require('../../config.json');
const fs = require('fs');
const path = require('path');

const { Client, ClientOptions, GuildMember } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Rest = new REST({ version: '9' }).setToken(config.token);

module.exports = class extends Client
{
  /**
   * 
   * @param {ClientOptions} options 
   */
  constructor(options) {
    super(options);

    this.commands = [];
    this.config = config;
  }

  loadSlashCommands(dir, guilds = []) {
    const r = (...s) => path.resolve(s.join(path.sep));
    const load = (file) => {
      let cmd = new (require(r(file)))();
      if(cmd.options && cmd.execute) this.commands.push(cmd);
    }

    fs.readdirSync(r(dir)).forEach((sdir) => {
      if(sdir.endsWith('.js')) return load(r(dir, sdir));
      fs.readdirSync(r(dir, sdir)).forEach((file) => {
        if(!file.endsWith('.js')) return;
        load(r(dir, sdir, file));
      });
    });

    guilds.forEach((id) => {
      Rest.put(
        Routes.applicationGuildCommands(this.config.application_id, id),
        { body: this.commands.map(({ options }) => options.toJSON()) }
      );
    });
  }

  loadEvents(dir) {
    const r = (...s) => path.resolve(s.join(path.sep));
    const load = (file) => {
      let evt = new (require(r(file)))();
      if(evt.name && evt.execute) {
        this.on(evt.name, evt.execute.bind(null, this));
      }
    }

    fs.readdirSync(r(dir)).forEach((sdir) => {
      if(sdir.endsWith('.js')) return load(r(dir, sdir));
      fs.readdirSync(r(dir, sdir)).forEach((file) => {
        if(!file.endsWith('.js')) return;
        load(r(dir, sdir, file));
      });
    });
  }

  /**
   * 
   * @param {GuildMember} member 
   */
  async createTicket(member) {
    member.guild.channels.create(`${member.user.username}`, {
      parent: this.config.tickets_parent_category_id,
      topic: member.id,
      permissionOverwrites: [
        {
          id: member.guild.id,
          deny: [ 'VIEW_CHANNEL' ]
        },
        {
          id: member.id,
          allow: config.user_permissions
        }
      ]
    }).then((ticket) => {
      ticket.send(config.tickets_create_message.replace(/{user}/gi, `<@${member.id}>`));
    });
  }

  /**
   * 
   * @param {GuildMember} member 
   */
  async closeTicket(member) {
    let guild = await member.guild.fetch();
    let channels = guild.channels.cache.filter((c) => c.isText() && c.topic == member.id);
    if (channels.size == 1)
      channels.first().delete("Member leaves the server");
  }
}