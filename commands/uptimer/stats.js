const UrlsConfig = require("./../../database/models/UrlsConfig");
const { MessageEmbed } = require("discord.js");
const { default_prefix } = require("./../../config.json");
const emoji = require('../../emoji.json')

module.exports = {
  name: "stats",
  description: "*Shows Stats of All of Your Projects*.",
  category: "uptime",
  aliases: [],
  botPermission: [],
  authorPermission: [],
  ownerOnly: false,
  run: async (client, message, args) => {
    const filter = {
      authorID: message.author.id,
    };

    const all = await UrlsConfig.find(filter);

    const menuEmoji = "<a:playing:933241885730938901>";

    let embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${menuEmoji} Your Projects Stats ${menuEmoji}`);

    let count = 0;
    all.forEach(async (data) => {
      count++;
      if (count === 26) return;
      // <:red_dot:841223022560280588>

      if (data.get("error")) {
        embed.addField(
          `**${count}**. \`${data.projectURL}\``,
          `<a:r_dot:935066570630262854> Last Pinged: ${
            data.updatedAt ? formatDate(data.updatedAt) : "Not Measured"
          }\n<:sinOffline:847689162500210688> FetchError: ${data.errorText}`
        );
      } else {
        embed.addField(
          `**${count}**. \`${data.projectURL}\``,
          `<:hydroxuptime:935067594438873088> Last Pinged: ${
            data.updatedAt ? formatDate(data.updatedAt) : "Not Measured"
          }`
        );
      }
    });

    if (count === 0) {
      embed.setDescription(
        `*You don't have any projects hosted.*\nAdd one by using: ${default_prefix}add [project Url]`
      );
    }
    embed.setFooter(`Date Format: DD/MM/YY | HH:MM:SS`);

    var errors = false;

    await message.author.send(embed).catch((err) => {
      errors = true;
      if (err.message === "<:no:933239221836206131> Cannot send messages to this user")
        return message.lineReply(
          `<:no:933239221836206131> \`Cannot send message to you. please turn on your Dms\`.`
        );
    });
    if (!errors) {
      message.channel.send("📥 Check your DM.");
    }
  },
};

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();
  hours = d.getHours();
  mins = d.getMinutes();
  sec = d.getSeconds();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  let format = `${day}/${month}/${year} | ${hours}:${mins}:${sec}`;

  return format;
}
