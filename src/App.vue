<template>
  <main>
    <header class="stats-intro">
      <h1></h1>
    </header>
    <input type="file" accept="application/zip" @change="handleData" />
    <article v-if="Object.entries(parsedData).length > 0" class="user-stats">
      <figure class="avatar">
        <img :src="`data:image/png;base64,${avatar}`" />
      </figure>
      <h2>username: {{ parsedData.user.username }}#{{ parsedData.user.discriminator }}</h2>
      <h2>total messages: {{ parsedData.user.totalMessageCount }}</h2>
      <DoughnutChart :chartData="messagesChartData" :options="chartOptions" />
      <h2>your top 3 servers:</h2>
      <ul>
        <li
          v-for="(serverName, position) in messagesChartData.labels.slice(0, 3)"
          :key="serverName"
        >
          #{{ position + 1 }}: {{ serverName }}
        </li>
      </ul>
    </article>
  </main>
</template>

<script>
  import { DoughnutChart } from 'vue-chart-3'
  import 'normalize.css'
  const AdmZip = require('adm-zip')

  export default {
    name: 'App',
    components: { DoughnutChart },
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
        this.messagesChartData = this.getMessagesChartData(servers)
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
      getMessagesChartData(servers) {
        let messagesChartData = { labels: [], datasets: [{ data: [] }] }
        servers
          .sort((a, b) => b.messageCount - a.messageCount)
          .forEach((server) => {
            messagesChartData.labels = [...messagesChartData.labels, server.name]
            messagesChartData.datasets = [
              { data: [...messagesChartData.datasets[0].data, server.messageCount] },
            ]
          })
        return messagesChartData
      },
    },
    data() {
      return {
        isExtracting: null,
        parsedData: {},
        avatar: '',
        messagesChartData: [],
        chartOptions: { plugins: { legend: { display: false } } },
      }
    },
  }
</script>

<style></style>
