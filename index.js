require("dotenv").config();

const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");
const os = require("os");

/* =======================
   CLIENT
======================= */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* =======================
   BASIC CONFIG
======================= */

const PREFIX = "?";
const TAG = "𝙎𝙏𝙓🧣";

/* =======================
   DEVELOPERS
======================= */

const DEVELOPERS = new Set([
  "1274503092154404908",
  "554749455669264394"
]);

/* =======================
   SELF REACT SYSTEM
======================= */

const selfReacts = new Map();

/* =======================
   AUTO EMOJIS
======================= */

const AUTO_EMOJIS = [
  "<:ah:1456330508853317632>",
  "<:la:1456330662372970558>"
];

const AUTO_CHANNEL_ID = "1451626940799782954";

/* =======================
   READY
======================= */

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "STYXGG BOT Safe Mode", type: 0 }],
    status: "online"
  });
});

/* =======================
   AUTO TAG + WELCOME DM NEW MEMBERS
======================= */

client.on("guildMemberAdd", async (member) => {
  if (member.user.bot) return;

  // Auto-tag nickname
  if (!member.displayName.startsWith(TAG)) {
    await member.setNickname(`${TAG} | ${member.displayName}`).catch(() => {
      console.log(`Unable to tag ${member.user.tag}`);
    });
  }

  // Send welcome DM
  try {
    await member.send(
`🎉 **Welcome to our Discord server!** 🎉

Hello **${member.user.username}**! We are happy to have you join our GRP WATSHAPP.  
💬 FEEL FREE TO EXPLORE CHANNELS AND ENJOY YOUR TIME!  
📌 MATNSSACH T9RA RULES AND HAVE FUN!

- **STYXGG Team**`
    );
  } catch (err) {
    console.log(`Could not send DM to ${member.user.tag}`);
  }
});

/* =======================
   MESSAGE HANDLER
======================= */

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot || !message.guild) return;

    /* AUTO SELF REACT */
    const guildReacts = selfReacts.get(message.guild.id);
    if (guildReacts) {
      for (const [emoji, users] of guildReacts) {
        if (users.has(message.author.id)) {
          await message.react(emoji).catch(() => {});
        }
      }
    }

    /* AUTO CHANNEL EMOJIS */
    if (message.channelId === AUTO_CHANNEL_ID) {
      for (const emoji of AUTO_EMOJIS) {
        await message.react(emoji).catch(() => {});
      }
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = (args.shift() || "").toLowerCase();

    /* =======================
       HELP
    ======================= */

    if (command === "help") {
      return message.reply(
`📌 **STYXGG BOT COMMANDS**

Hello! I am **STYXGG BOT**, developed by Li 7wak hh.  
For any help or support, contact NB4rr.

💡 **Core Features & Commands:**
?help - Shows this help message
?system - Display host and system information
?adddev / ?removedev - Developer management
?zidem / ?7ydem - Self-react management

✔️ Prefix check & secure commands  
✔️ Bot presence / status  
✔️ Global error handler  
✔️ Permission safety checks  
✔️ Clean, professional, well-commented code`
      );
    }

    /* =======================
       SYSTEM
    ======================= */

    if (command === "system") {
      const uptimeSeconds = process.uptime();
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);

      const memoryUsageMB = Math.round(process.memoryUsage().rss / 1024 / 1024);

      return message.reply(
`💻 Bot System Info
Host name: NB4rr's bot
CPU: Intel Core i7 14700KF - 16GB RAM
Architecture: x64
IP Address: 99.224.137.58
Node Version: ${process.version}
Uptime: ${hours} hours ${minutes} minutes
Memory Usage: ${memoryUsageMB} MB / 16 GB
Guilds: ${client.guilds.cache.size}`
      );
    }

    /* =======================
       DEV COMMANDS
    ======================= */

    if (command === "adddev" || command === "removedev") {
      if (!DEVELOPERS.has(message.author.id))
        return message.reply("❌ Unauthorized");

      const user =
        message.mentions.users.first() ||
        message.guild.members.cache.get(args[0])?.user;

      if (!user) return message.reply("❌ Invalid user");

      command === "adddev"
        ? DEVELOPERS.add(user.id)
        : DEVELOPERS.delete(user.id);

      return message.reply("✅ Developer list updated");
    }

    /* =======================
       SELF REACT COMMANDS
    ======================= */

    if (command === "zidem" || command === "7ydem") {
      if (!DEVELOPERS.has(message.author.id))
        return message.reply("❌ Developer only");

      const member = message.mentions.members.first();
      const emoji = args.slice(1).join(" ");

      if (!member || !emoji)
        return message.reply("❌ Missing arguments");

      if (!selfReacts.has(message.guild.id))
        selfReacts.set(message.guild.id, new Map());

      const g = selfReacts.get(message.guild.id);
      if (!g.has(emoji)) g.set(emoji, new Set());

      command === "zidem"
        ? g.get(emoji).add(member.id)
        : g.get(emoji).delete(member.id);

      return message.reply("✅ Done");
    }

  } catch (err) {
    console.log("Error:", err);
  }
});

/* =======================
   LOGIN
======================= */

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

client.login(process.env.BOT_TOKEN);

/* =======================
   GLOBAL ERROR HANDLER
======================= */

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
