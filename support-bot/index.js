const path = require('path');

const { Intents } = require('discord.js');

const Client = require('./src/structure/Client');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });

client.loadSlashCommands(path.resolve(__dirname, 'src', 'commands'), client.config.guilds_id);
client.loadEvents(path.resolve(__dirname, 'src', 'events'));


client.login(client.config.token);