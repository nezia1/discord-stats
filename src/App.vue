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
        const zip = new AdmZip(discordData.path)
        const zipEntries = zip.getEntries()
        let servers = []
        let totalMessageCount = 0
        // Get message count per server and create an entry in the servers array
        zipEntries.forEach((zipEntry) => {
          if (!zipEntry.isDirectory) {
            const serverRegex = /messages\/(?<channelId>.+)\/messages.csv/
            const serverMatch = serverRegex.exec(zipEntry.entryName)
            if (serverMatch !== null) {
              const channelId = serverMatch.groups.channelId
              // Gets the related channel.json file using the channel id
              const jsonString = zip.readFile(`messages/${channelId}/channel.json`).toString()
              const channel = JSON.parse(jsonString)
              // If channel.json has no guild property, it's a DM / group DM conversation
              if ('guild' in channel) {
                const serverMessageCount = zipEntry.getData().toString().split('\n').length
                totalMessageCount += serverMessageCount
                servers.push({
                  id: channel.guild.id,
                  name: channel.guild.name,
                  messageCount: serverMessageCount,
                })
              }
            }
          }
        })
        this.parsedData = { totalMessageCount, servers }
      },
    },
    data() {
      return {
        isExtracting: null,
        parsedData: {},
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
