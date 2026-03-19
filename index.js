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
const BOT_OWNER_ID = "1274503092154404908"; // Replace with your Discord user ID
const MENTION_GIF_URL = "https://i.pinimg.com/originals/b2/ff/d9/b2ffd9de76ce9385a2577daad6505575.gif"; // <<< REPLACE WITH YOUR GIF URL

/* ======================= AUTO-KICK VOICE ======================= */
const VC_CHANNEL_ID = "1483592724480393286"; // Remplace par ton channel
const allowedUsers = new Set(["1274503092154404908",
                             "1078169863664701531",
                             "699694653620093048",
                             "922556935633510491",
                             "1352410503032344599"
                             ]); // Commence avec les devs

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
        return message.reply(`✅ ${member.user.tag} Sf dkhol`);
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
        activities: [{ name: "4rr BOT Safe Mode", type: 0 }],
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

        /* ======================= MENTION REPLY SYSTEM ======================= */
        // Check if the bot owner is mentioned in the message
        if (
            message.mentions.users.has(BOT_OWNER_ID) &&
            message.author.id !== BOT_OWNER_ID &&
            !message.author.bot
        ) {
            try {
                // Fetch the owner's presence from the guild
                const ownerMember = await message.guild.members.fetch(BOT_OWNER_ID).catch(() => null);

                if (ownerMember) {
                    const presence = ownerMember.presence;
                    const status = presence ? presence.status : "offline"; // online, idle, dnd, offline/invisible

                    if (status === "online" || status === "idle") {
                        // Owner is available — send GIF + message
                        await message.reply({
                            content: `Blati ana jay\n${MENTION_GIF_URL}`
                        });
                    } else {
                        // Owner is DND or invisible/offline
                        await message.reply({
                            content: `Makayench`
                        });
                    }
                }
            } catch (err) {
                console.log("Error in mention reply system:", err);
            }
        }

        if (!message.content.startsWith(PREFIX)) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/);
        const command = (args.shift() || "").toLowerCase();

        /* ======================= HELP ======================= */
        if (command === "help") {
            return message.reply(
`<:444:1456338630162256096> **4rr BOT COMMANDS**\n` +
`Hello! I am **4rr BOT**. Here are my main commands:\n\n` +
`<a:FlecheSTX:1455957814878015549> **Voice Control:**\n` +
`?ydkhol @user - Allow a user to join restricted VC\n` +
`?maydkholch @user - Remove a user from VC whitelist\n` +
`?aji - Join a voice channel 24/7\n` +
`?aji <channel_id> - Join a specific voice channel by ID\n` +
`?sir - Leave the voice channel\n\n` +
`<a:FlecheSTX:1455957814878015549> **Tag System:**\n` +
`?tag @member - Tag a specific member with custom tag\n` +
`?tagall - Tag all members\n` +
`?untagall - Remove tag from all members\n` +
`?settag <emoji/text> - Set custom tag\n\n` +
`<a:FlecheSTX:1455957814878015549> **Reactions:**\n` +
`?zidem @user <:Kika:1451585188369793074> - Auto react\n` +
`?7ydem @user <:Kika:1451585188369793074> - Remove reaction\n\n` +
`<a:FlecheSTX:1455957814878015549> **Other:**\n` +
`?system - Display host and system information`
            );
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
            return message.reply(`✅ Tagged ${member.user.tag}`);
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
            return message.reply(`✅ Tagged ${count} members`);
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
            return message.reply(`✅ Removed tag from ${count} members`);
        }

        /* ======================= SETTAG ======================= */
        if (command === "settag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            if (!args.length) return message.reply("❌ Provide a tag");
            CUSTOM_TAG = args.join(" ");
            return message.reply(`✅ Tag set to: ${CUSTOM_TAG}`);
        }

        /* ======================= CURRENTTAG ======================= */
        if (command === "currenttag") {
            return message.reply(`🏷️ Current tag: ${CUSTOM_TAG}`);
        }

        /* ======================= RESETTAG ======================= */
        if (command === "resettag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            CUSTOM_TAG = DEFAULT_TAG;
            return message.reply(`✅ Tag reset to: ${CUSTOM_TAG}`);
        }

        /* ======================= ADDDEV ======================= */
        if (command === "adddev") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            DEVELOPERS.add(member.id);
            return message.reply(`✅ ${member.user.tag} is now a developer`);
        }

        /* ======================= REMOVEDEV ======================= */
        if (command === "removedev") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            if (member.id === message.author.id) return message.reply("❌ You can't remove yourself");
            DEVELOPERS.delete(member.id);
            return message.reply(`✅ ${member.user.tag} removed from developers`);
        }

        /* ======================= ZIDEM (AUTO REACT) ======================= */
        if (command === "zidem") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");

            // L'emoji est le dernier argument (après le mention)
            const emojiArg = args.find(a => !a.startsWith("<@") && a !== member.id) || args[args.length - 1];
            if (!emojiArg) return message.reply("❌ Provide an emoji");

            if (!selfReacts.has(message.guild.id)) selfReacts.set(message.guild.id, new Map());
            const guildMap = selfReacts.get(message.guild.id);

            if (!guildMap.has(emojiArg)) guildMap.set(emojiArg, new Set());
            guildMap.get(emojiArg).add(member.id);

            return message.reply(`✅ Done ${emojiArg} on ${member.user.tag}'s messages`);
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

            return message.reply(`✅ Removed ${emojiArg} from ${member.user.tag}`);
        }

        /* ======================= AJI (JOIN VOICE) ======================= */
        if (command === "aji") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");

            const { joinVoiceChannel } = require("@discordjs/voice");

            let targetChannel = null;

            if (args[0]) {
                // ?aji <channel_id> — join specific channel by ID
                targetChannel = message.guild.channels.cache.get(args[0]);
                if (!targetChannel || targetChannel.type !== 2) {
                    return message.reply("❌ Invalid voice channel ID");
                }
            } else {
                // ?aji — join the author's current voice channel
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
                    selfMute: true
                });
                return message.reply(`✅ Hana jit **${targetChannel.name}** and staying 24/7`);
            } catch (err) {
                console.log("Error joining VC:", err);
                return message.reply("❌ Failed to join the voice channel");
            }
        }

        /* ======================= SIR (LEAVE VOICE) ======================= */
        if (command === "siri") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");

            const { getVoiceConnection } = require("@discordjs/voice");

            const connection = getVoiceConnection(message.guild.id);
            if (!connection) {
                return message.reply("❌ I am not in any voice channel");
            }

            connection.destroy();
            return message.reply("✅ Haya Ghadiya");
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
        console.log(`✅ Auto-tagged new member: ${member.user.tag} with ${CUSTOM_TAG}`);
    } catch (error) {
        console.log(`⚠️ Unable to tag ${member.user.tag}: ${error.message}`);
    }

    try {
        await member.send(
`🎉 **Welcome!** 🎉\n` +
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