module.exports = {
  name: "dj-role",
  aliases: ["dj", "djrole", "djr"],
  cat: "settings",
  usage: "dj-role <enable|disable> [role name or mention]",
  desc: "Sets or disables DJ Role. Only members with the DJ Role can use music commands.",
  async execute(
    msg,
    args,
    client,
    channel,
    author,
    server,
    guild,
    botMem,
    botNick,
    testServer,
    defChannel,
    me,
    allowed,
    prefix,
    config,
    exec,
    os,
    Discord,
    preDB,
    nbDB,
    bchDB,
    blDB,
    wcDB,
    djDB
  ) {
    if (!msg.member.permissions.has("MANAGE_ROLES"))
      return msg.reply(
        "You must have the `MANAGE_ROLES` permission to do that!"
      );

    if (!args[0]) return msg.reply(`Usage: \`${prefix}${this.usage}\``);

    if (args[0].toLowerCase() == "enable") {
      async function setRole(role) {
        let roleID = role.id;

        let alreadySet = djDB.get(guild.id);

        await djDB.set(guild.id, roleID);

        let message = alreadySet
          ? `Changed DJ role to ${role}`
          : `Set DJ role to ${role}`;

        msg.channel.send(message);
      }

      if (msg.mentions.roles.length > 0) {
        let role = msg.mentions.roles.first();
        await setRole(role);
      } else if (args[1]) {
        let RoleName = args;
        RoleName.shift();
        let roleName = RoleName.join(" ");
        let Role = guild.roles.cache.find((x) => x.name === roleName);
        if (!Role) {
          if (!botMem.permissions.has("MANAGE_ROLES"))
            return msg.reply(
              "I need the `MANAGE_ROLES` permission to do that!"
            );
          msg.channel.send(`Role doesn't exist, creating it!`);
          await guild.roles.create({
            name: `${roleName}`,
            color: "BLUE",
            permissions: [],
          });
          let role = guild.roles.cache.find((x) => x.name === roleName);
          await setRole(role);
        } else {
          let role = Role;
          await setRole(role);
        }
      } else {
        let roleName = "Simp_Bot_DJ";
        let Role = guild.roles.cache.find((x) => x.name === roleName);
        if (!Role) {
          if (!botMem.permissions.has("MANAGE_ROLES"))
            return msg.reply(
              "I need the `MANAGE_ROLES` permission to do that!"
            );

          await guild.roles.create({
            name: `${roleName}`,
            color: "BLUE",
            permissions: [],
          });
          let role = guild.roles.cache.find((x) => x.name === roleName);
          await setRole(role);
        } else {
          let role = Role;
          await setRole(role);
        }
      }
    } else if (args[0].toLowerCase() == "disable") {
      let djRole = djDB.get(guild.id);

      if (!djRole) return msg.reply(`DJ Role is not enabled in this server!`);

      await djDB.delete(guild.id);

      channel.send("Disabled DJ Role for the server!");
    } else return msg.reply(`Usage: \`${prefix}${this.usage}\``);
  },
};
