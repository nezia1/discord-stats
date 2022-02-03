<template>
  <main>
    <input type="file" accept="application/zip" @change="handleData" />
  </main>
</template>

<script>
  const AdmZip = require('adm-zip')

  export default {
    name: 'App',
    methods: {
      handleData(e) {
        const discordData = e.target.files[0]
        const servers = this.getParsedServersData(discordData)
        const user = {
          ...this.getUserData(discordData),
          totalMessageCount: this.getTotalMessages(servers),
        }
        this.parsedData = { user, servers }
        this.avatar = this.getUserAvatar(discordData)
      },
      getParsedServersData(discordData) {
        const zip = new AdmZip(discordData.path)
        const zipEntries = zip.getEntries()
        // Get message count per server and create an entry in the servers array
        return (
          zipEntries
            // Filters out non messages files and makes sure it belongs to a guild (not a DM conversation)
            .filter((zipEntry) => {
              if (zipEntry.entryName.match(/messages\/.+\/messages.csv/)) {
                const channelId = zipEntry.entryName.split('/')[1]
                // Gets the related channel.json file using the channel id
                const jsonString = zip.readFile(`messages/${channelId}/channel.json`).toString()
                const channel = JSON.parse(jsonString)
                // If channel.json has no guild property, it's a DM / group DM conversation
                if ('guild' in channel) {
                  return true
                }
                return false
              }
            })
            .map((zipEntry) => {
              const channelId = zipEntry.entryName.split('/')[1]
              const jsonString = zip.readFile(`messages/${channelId}/channel.json`).toString()
              const channel = JSON.parse(jsonString)
              const serverMessageCount = zipEntry.getData().toString().split('\n').length
              return {
                id: channel.guild.id,
                name: channel.guild.name,
                messageCount: serverMessageCount,
              }
            })
        )
      },
      getTotalMessages(servers) {
        return servers.reduce((total, server) => {
          return total + server.messageCount
        }, 0)
      },
      getUserData(discordData) {
        const zip = new AdmZip(discordData.path)
        const jsonString = zip.readFile('account/user.json').toString()
        const { username, discriminator, email } = JSON.parse(jsonString)
        return { username, discriminator, email }
      },
      getUserAvatar(discordData) {
        const zip = new AdmZip(discordData.path)
        return zip.readFile('account/avatar.png').toString('base64')
      },
    },
    data() {
      return {
        isExtracting: null,
        parsedData: {},
        avatar: '',
      }
    },
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
