const Command = require('../structure/Command');
const Client = require('../structure/Client');

const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class extends Command
{
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("say")
        .setDescription("Send message in all tickets.")
        .addStringOption((option) => option
          .setName("message")
          .setDescription("Message to send")
          .setRequired(true)
          )
        .addStringOption((option) => option
          .setName("color")
          .setDescription("embed's color")
          .setRequired(false)
          )
        .addStringOption((option) => option
          .setName("title")
          .setDescription("embed's title")
          .setRequired(false)
          )
    )
  }

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  async execute(client, interaction) {
    let log_count = 0;
    let log_channel_size = 0;
  
    let guild = await interaction.guild.fetch();
    let channels = guild.channels.cache.filter((c) => c.parentId == client.config.tickets_parent_category_id && c.isText() && c.topic);

    if (!interaction.member.permissions.has('ADMINISTRATOR'))
      return interaction.reply({ ephemeral: true, content: "You do not have the permission." });

    log_channel_size = channels.size;
    if (channels.size < 1)
      return interaction.reply({ ephemeral: true, content: "There is no tickets." });
    
    let message = interaction.options.getString("message");
    let color = interaction.options.getString("color");
    if (!color || !/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color))
      color = client.config.say.default_color;
    let embed = new MessageEmbed()
      .setColor(color)
      .setDescription("")
    if (interaction.options.getString("title") || client.config.say.default_title != "")
      embed.setTitle(interaction.options.getString("title") || client.config.say.default_title);

    channels.forEach((channel) => {
      if (channel.isText()) {
        let userMention = `<@${channel.topic}>`;
        embed.setDescription(message.replace(/{user}/gi, userMention));
        channel.send({ content: userMention, embeds: [embed] });
        log_count++;
      }
    });

    interaction.reply({ content: `**Messages sent!** \`Logs:\`\n**${log_channel_size}** tickets channels.\n**${log_count}** messages sent.` })
  }
}