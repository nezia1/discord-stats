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
        // Get list of servers with their ids
        const servers = []
        zipEntries.forEach((zipEntry) => {
          if (!zipEntry.isDirectory) {
            if (zipEntry.name === 'guild.json') {
              const jsonString = zipEntry.getData().toString()
              servers.push(JSON.parse(jsonString))
            }
          }
        })
        this.parsedData = { ...this.parsedData, servers }
        console.log(this.parsedData)
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
