const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['USER', 'CHANNEL', 'MESSAGE', 'REACTION' ]})
const { token, emojiReact, channelID, embedColor } = require(`./config.json`)


client.on(`ready`, () => {
    console.log(`${client.user.username} started.`)
})

client.on(`messageReactionAdd`, async(reaction, user) => {
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.id === channelID);
        const msgs = await starboard.messages.fetch({ limit: 100 });
        const existingMsg = msgs.find(msg => 
            msg.embeds.length === 1 ?
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if(existingMsg) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
            .setDescription(`${reaction.message.content}\n[Jump to message](${reaction.message.url})`,)
            .setFooter(`${reaction.message.id} | ${reaction.count}${emojiReact}`)
            .setColor(embedColor)
            .addField(`Channel`, reaction.message.channel, true)
            .setTimestamp()
            if(reaction.message.attachments.size > 0) {
                await embed.setImage(reaction.message.attachments.first().proxyURL)
            }
          existingMsg.edit(embed);
            
         } else {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
                    .setDescription(`${reaction.message.content}\n[Jump to message](${reaction.message.url})`)
                    .setFooter(`${reaction.message.id} | 1${emojiReact}`)
                    .setColor(embedColor)
                    .addField(`Channel`, reaction.message.channel, true)
                    .setTimestamp()
                    if(reaction.message.attachments.size > 0) {
                        await embed.setImage(reaction.message.attachments.first().proxyURL)
                    }
    
              if(starboard)
                  starboard.send(embed);
          }
        }
  
    if(reaction.emoji.name === emojiReact) {
        if(reaction.message.channel.id === channelID) return;
        if(reaction.message.partial) { 
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else {
            handleStarboard();
        }
    }
})

client.on(`messageReactionRemove`, (reaction, user) => {
    const handleStarboard = async () => {
        const starboard = client.channels.cache.find(channel => channel.id === channelID);
        const msgs = await starboard.messages.fetch({ limit: 100 });
        const existingMsg = msgs.find(msg => 
            msg.embeds.length === 1 ? 
            (msg.embeds[0].footer.text.startsWith(reaction.message.id) ? true : false) : false);
        if(existingMsg) {
            if(reaction.count === 0)
                existingMsg.delete({ timeout: 2500 });
            else {
                const embed = new Discord.MessageEmbed()
                .setAuthor(reaction.message.author.tag, reaction.message.author.displayAvatarURL())
                .setDescription(`${reaction.message.content}\n[Jump to message](${reaction.message.url})`)
                .setFooter(`${reaction.message.id} | ${reaction.count}${emojiReact}`)
                .setColor(embedColor)
                .addField(`Salon`, reaction.message.channel, true)
                .setTimestamp()
                if(reaction.message.attachments.size > 0) {
                    embed.setImage(reaction.message.attachments.first().proxyURL)
                }
                existingMsg.edit(embed)
            }
                
        };
    }
    if(reaction.emoji.id === emojiReact) {
        if(reaction.message.channel.id === channelID) return;
        if(reaction.message.partial) {
            await reaction.fetch();
            await reaction.message.fetch();
            handleStarboard();
        }
        else
            handleStarboard();
    }

})

client.login(token)