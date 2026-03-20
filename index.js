require("dotenv").config();
const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require("discord.js");

/* ======================= CLIENT ======================= */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

/* ======================= BASIC CONFIG ======================= */
const PREFIX = "?";
const DEFAULT_TAG = "𝙎𝙏𝙓🌙";
let CUSTOM_TAG = DEFAULT_TAG;

/* ======================= DEVELOPERS ======================= */
const DEVELOPERS = new Set([
    "1274503092154404908",
    "554749455669264394"
]);

/* ======================= BOT OWNER ID (for mention reply) ======================= */
const BOT_OWNER_ID = "1274503092154404908";
const MENTION_GIF_URL = "https://i.pinimg.com/originals/b2/ff/d9/b2ffd9de76ce9385a2577daad6505575.gif";

/* ======================= AUTO-KICK VOICE ======================= */
const VC_CHANNEL_ID = "1483592724480393286";
const allowedUsers = new Set(["1274503092154404908",
                             "1078169863664701531",
                             "699694653620093048",
                             "922556935633510491",
                             "1352410503032344599"
                             ]);

client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = (args.shift() || "").toLowerCase();

    // ?ydkhol - add to allowedUsers
    if (command === "ydkhol") {
        if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply("❌ Mention a valid member");
        allowedUsers.add(member.id);
        return message.reply(`<a:done:1347594035208130662> ${member.user.tag} Sf dkhol`);
    }

    // ?maydkholch - remove from allowedUsers
    if (command === "maydkholch") {
        if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply("❌ Mention a valid member");
        allowedUsers.delete(member.id);
        return message.reply(`❌ ${member.user.tag} Zab ladkholti`);
    }
});

/* ======================= SELF REACT SYSTEM ======================= */
const selfReacts = new Map();
const AUTO_EMOJIS = ["<:ah:1456330508853317632>", "<:la:1456330662372970558>"];
const AUTO_CHANNEL_ID = "1451626940799782954";
const checkPagination = new Map();

/* ======================= HELPER FUNCTIONS ======================= */
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
}

/* ======================= READY ======================= */
client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log(`📅 Today is: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    client.user.setPresence({
        activities: [{ name: "NB4rr Bot Safe Mode", type: 0 }],
        status: "online"
    });
    console.log(`🏠 Bot is ready! Custom tag set to: ${CUSTOM_TAG}`);
});

/* ======================= MESSAGE HANDLER ======================= */
client.on("messageCreate", async (message) => {
    try {
        if (message.author.bot || !message.guild) return;

        // Self react system
        const guildReacts = selfReacts.get(message.guild.id);
        if (guildReacts) {
            for (const [emoji, users] of guildReacts) {
                if (users.has(message.author.id)) {
                    await message.react(emoji).catch(() => {});
                }
            }
        }

        // Auto emojis in specific channel
        if (message.channelId === AUTO_CHANNEL_ID) {
            for (const emoji of AUTO_EMOJIS) {
                await message.react(emoji).catch(() => {});
            }
        }


        if (!message.content.startsWith(PREFIX)) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = (args.shift() || "").toLowerCase();

        /* ======================= HELP ======================= */
        if (command === "help") {
            const helpEmbed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setAuthor({
                    name: "4rr BOT — Command List",
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription("Here are all available commands. Prefix: **`?`**")
                .addFields(
                    {
                        name: "<a:FlecheSTX:1455957814878015549> Voice Control",
                        value: [
                            "`?aji` — Join your current voice channel",
                            "`?aji <id>` — Join a specific voice channel",
                            "`?siri` — Leave the voice channel",
                            "`?siftina <id>` — Mass move your VC members to another VC",
                            "`?ydkhol @user` — Allow a user into restricted VC",
                            "`?maydkholch @user` — Remove a user from VC whitelist",
                        ].join("\n"),
                        inline: false
                    },
                    {
                        name: "<a:FlecheSTX:1455957814878015549> Tag System",
                        value: [
                            "`?tag @member` — Tag a specific member",
                            "`?tagall` — Tag all members",
                            "`?untagall` — Remove tag from all members",
                            "`?settag <text>` — Set a custom tag",
                            "`?resettag` — Reset tag to default",
                            "`?currenttag` — Show current tag",
                        ].join("\n"),
                        inline: false
                    },
                    {
                        name: "<a:FlecheSTX:1455957814878015549> Reactions",
                        value: [
                            "`?zidem @user <emoji>` — Set auto react on a user",
                            "`?7ydem @user <emoji>` — Remove auto react from a user",
                        ].join("\n"),
                        inline: false
                    },
                    {
                        name: "<a:FlecheSTX:1455957814878015549> Other",
                        value: [
                            "`?system` — Show bot system info",
                            "`?adddev @user` — Add a developer",
                            "`?removedev @user` — Remove a developer",
                        ].join("\n"),
                        inline: false
                    }
                )
                .addFields({
                        name: "​",
                        value: "<:444:1456338630162256096> La mhtaj chi mosa3ada sift liya f DM <@1274503092154404908> bch manjawbkch",
                        inline: false
                    })
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            return message.reply({ embeds: [helpEmbed] });
        }

        /* ======================= SYSTEM ======================= */
        if (command === "system") {
            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const memoryUsageMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
            return message.reply(
`💻 Bot System Info\n` +
`Host: NB4rr's bot\n` +
`Node Version: ${process.version}\n` +
`Uptime: ${hours}h ${minutes}m\n` +
`Memory: ${memoryUsageMB} MB\n` +
`Guilds: ${client.guilds.cache.size}\n` +
`Current tag: ${CUSTOM_TAG}`
            );
        }

        /* ======================= TAG ======================= */
        if (command === "tag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            let cleanName = member.displayName.replace(/^.+?\s*\|\s*/, "").trim() || member.user.username;
            await member.setNickname(`${CUSTOM_TAG} ${cleanName}`).catch(() => {});
            return message.reply(`<a:done:1347594035208130662> Tagged ${member.user.tag}`);
        }

        /* ======================= TAGALL ======================= */
        if (command === "tagall") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const members = await message.guild.members.fetch();
            let count = 0;
            for (const [, member] of members) {
                if (member.user.bot) continue;
                let cleanName = member.displayName.replace(/^.+?\s*\|\s*/, "").trim() || member.user.username;
                await member.setNickname(`${CUSTOM_TAG} ${cleanName}`).catch(() => {});
                count++;
            }
            return message.reply(`<a:done:1347594035208130662> Tagged ${count} members`);
        }

        /* ======================= UNTAGALL ======================= */
        if (command === "untagall") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const members = await message.guild.members.fetch();
            let count = 0;
            for (const [, member] of members) {
                if (member.user.bot) continue;
                await member.setNickname(null).catch(() => {});
                count++;
            }
            return message.reply(`<a:done:1347594035208130662> Removed tag from ${count} members`);
        }

        /* ======================= SETTAG ======================= */
        if (command === "settag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            if (!args.length) return message.reply("❌ Provide a tag");
            CUSTOM_TAG = args.join(" ");
            return message.reply(`<a:done:1347594035208130662> Tag set to: ${CUSTOM_TAG}`);
        }

        /* ======================= CURRENTTAG ======================= */
        if (command === "currenttag") {
            return message.reply(`🏷️ Current tag: ${CUSTOM_TAG}`);
        }

        /* ======================= RESETTAG ======================= */
        if (command === "resettag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            CUSTOM_TAG = DEFAULT_TAG;
            return message.reply(`<a:done:1347594035208130662> Tag reset to: ${CUSTOM_TAG}`);
        }

        /* ======================= ADDDEV ======================= */
        if (command === "adddev") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            DEVELOPERS.add(member.id);
            return message.reply(`<a:done:1347594035208130662> ${member.user.tag} is now a developer`);
        }

        /* ======================= REMOVEDEV ======================= */
        if (command === "removedev") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            if (member.id === message.author.id) return message.reply("❌ You can't remove yourself");
            DEVELOPERS.delete(member.id);
            return message.reply(`<a:done:1347594035208130662> ${member.user.tag} removed from developers`);
        }

        /* ======================= ZIDEM (AUTO REACT) ======================= */
        if (command === "zidem") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");

            const emojiArg = args.find(a => !a.startsWith("<@") && a !== member.id) || args[args.length - 1];
            if (!emojiArg) return message.reply("❌ Provide an emoji");

            if (!selfReacts.has(message.guild.id)) selfReacts.set(message.guild.id, new Map());
            const guildMap = selfReacts.get(message.guild.id);

            if (!guildMap.has(emojiArg)) guildMap.set(emojiArg, new Set());
            guildMap.get(emojiArg).add(member.id);

            return message.reply(`<a:done:1347594035208130662> Done ${emojiArg} on ${member.user.tag}'s messages`);
        }

        /* ======================= 7YDEM (REMOVE AUTO REACT) ======================= */
        if (command === "7ydem") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");

            const emojiArg = args.find(a => !a.startsWith("<@") && a !== member.id) || args[args.length - 1];
            if (!emojiArg) return message.reply("❌ Provide an emoji");

            const guildMap = selfReacts.get(message.guild.id);
            if (!guildMap || !guildMap.has(emojiArg)) return message.reply("❌ No reaction found for this emoji");

            guildMap.get(emojiArg).delete(member.id);
            if (guildMap.get(emojiArg).size === 0) guildMap.delete(emojiArg);

            return message.reply(`<a:done:1347594035208130662> Removed ${emojiArg} from ${member.user.tag}`);
        }

        /* ======================= AJI (JOIN VOICE) ======================= */
        if (command === "aji") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");

            const { joinVoiceChannel } = require("@discordjs/voice");

            let targetChannel = null;

            if (args[0]) {
                targetChannel = message.guild.channels.cache.get(args[0]);
                if (!targetChannel || targetChannel.type !== 2) {
                    return message.reply("❌ Invalid voice channel ID");
                }
            } else {
                const authorMember = await message.guild.members.fetch(message.author.id).catch(() => null);
                if (!authorMember || !authorMember.voice.channelId) {
                    return message.reply("❌ You are not in a voice channel");
                }
                targetChannel = authorMember.voice.channel;
            }

            try {
                joinVoiceChannel({
                    channelId: targetChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false,
                    selfMute: false
                });
                return message.reply(`<a:done:1347594035208130662> Hana jit`);
            } catch (err) {
                console.log("Error joining VC:", err);

            }
        }

        /* ======================= SIRI (LEAVE VOICE) ======================= */
        if (command === "siri") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");

            const { getVoiceConnection } = require("@discordjs/voice");

            const connection = getVoiceConnection(message.guild.id);
            if (!connection) {
                return message.reply("❌ I am not in any voice channel");
            }

            connection.destroy();
            return message.reply("<a:done:1347594035208130662> Haya Ghadiya");
        }

        /* ======================= SIFTINA (MASS MOVE) ======================= */
        if (command === "siftina") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");

            const targetChannelId = args[0];
            if (!targetChannelId) return message.reply("❌ Use: `?siftina <channel_id>`");

            const targetChannel = message.guild.channels.cache.get(targetChannelId);
            if (!targetChannel || targetChannel.type !== 2) return message.reply("❌ Invalid voice channel ID");

            const authorMember = await message.guild.members.fetch(message.author.id).catch(() => null);
            if (!authorMember || !authorMember.voice.channelId) return message.reply("❌ You must be in a voice channel");

            const sourceChannel = authorMember.voice.channel;
            if (sourceChannel.id === targetChannelId) return message.reply("❌ Same channel");

            const members = sourceChannel.members;
            if (members.size === 0) return message.reply("❌ No members in your voice channel");

            let moved = 0;
            for (const [, member] of members) {
                if (member.user.bot) continue;
                await member.voice.setChannel(targetChannel).catch(() => {});
                moved++;
            }

            return message.reply(`<a:done:1347594035208130662> Moved ${moved} members to **${targetChannel.name}**`);
        }

    } catch (err) {
        console.log("Error:", err);
    }
});

/* ======================= AUTO TAG + WELCOME DM ======================= */
client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;

    try {
        let oldNickname = member.displayName;
        const tagPattern = /^(?:STX|𝙎𝙏𝙓)?[🌙🧣⚡✨⭐🌟🔆]?\s*(?:\|\s*)?/;
        let cleanName = oldNickname.replace(tagPattern, '');
        if (!cleanName.trim()) cleanName = oldNickname;
        await member.setNickname(`${CUSTOM_TAG} ${cleanName.trim()}`);
        console.log(`<a:done:1347594035208130662> Auto-tagged new member: ${member.user.tag} with ${CUSTOM_TAG}`);
    } catch (error) {
        console.log(`⚠️ Unable to tag ${member.user.tag}: ${error.message}`);
    }

    try {
        await member.send(
`<:444:1456338630162256096> **Welcome!** <:444:1456338630162256096>\n` +
`Hello **${member.user.username}**!\n` +
`Enjoy your time and read the rules!\n\n` +
`- **4RR Team**`
        );
    } catch (err) {
        console.log(`Could not send DM to ${member.user.tag}`);
    }
});

/* ======================= AUTO-KICK VOICE HANDLER ======================= */
client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
        if (!newState.channelId) return;
        if (newState.channelId !== VC_CHANNEL_ID) return;

        if (!allowedUsers.has(newState.id)) {
            await newState.disconnect("Not allowed in this VC");
            console.log(`⚠️ ${newState.member.user.tag} was auto-kicked from VC`);
        }
    } catch (err) {
        console.log("Error in auto-kick VC:", err);
    }
});

/* ======================= LOGIN ======================= */
if (!process.env.BOT_TOKEN) {
    console.error("❌ BOT_TOKEN missing in .env");
    process.exit(1);
}
client.login(process.env.BOT_TOKEN);

/* ======================= GLOBAL ERROR HANDLER ======================= */
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});