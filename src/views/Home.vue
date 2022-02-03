<template>
  <main class="container">
    <header v-if="Object.entries(parsedData).length === 0" class="stats-intro">
      <h1>Discord Stats</h1>
      <h2>Get statistics about your Discord usage.</h2>
      <div class="stats-input-field">
        <input
          type="file"
          class="stats-input"
          id="stats-input"
          accept="application/zip"
          @change="handleData"
        />
        <label for="stats-input">Upload your data</label>
      </div>
    </header>
    <section v-else class="user-stats">
      <h1>your data</h1>
      <header class="user-info">
        <figure class="avatar">
          <img :src="`data:image/png;base64,${avatar}`" alt="" srcset="" />
        </figure>
        <section class="user-infos">
          <h2>{{ parsedData.user.username }}#{{ parsedData.user.discriminator }}</h2>
          <h2>total messages: {{ parsedData.user.totalMessageCount.toLocaleString('en-US') }}</h2>
        </section>
      </header>
      <DoughnutChart style="margin: 2rem" :chartData="messagesChartData" :options="chartOptions" />
      <h2>your top 3 servers</h2>
      <ul class="top-servers">
        <li
          v-for="(serverName, position) in messagesChartData.labels.slice(0, 3)"
          :key="serverName"
        >
          #{{ position + 1 }} • {{ serverName }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
  import { DoughnutChart } from 'vue-chart-3'
  import 'normalize.css'
  const AdmZip = require('adm-zip')

  export default {
    name: 'Home',
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

<style scoped>
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
  }

  .stats-intro h2 {
    font-family: 'Whitney';
  }
  .stats-input {
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
  }

  .stats-input + label {
    display: block;
    position: relative;
    width: 100%;
    height: 3em;
    border-radius: 0.2rem;
    background-color: #5865f2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-stats {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    font-family: 'Whitney';
  }

  .user-info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;
  }

  .avatar {
    width: 100%;
    height: auto;
    margin: 0;
    margin-right: 1.5rem;
    flex-shrink: 1;
    flex-basis: 8%;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .avatar img {
    width: 100%;
    height: auto;
    border-radius: 50%;
  }

  .top-servers {
    list-style: none;
    text-align: left;
  }
</style>
