<template>
  <main class="container">
    <article class="explanation">
      <h1>Request your Discord data package</h1>
      <p>
        To start generating statistics for your Discord account, you will need a data package. This
        can be found in your Discord settings, under Privacy & Safety > Request all of my Data. If
        you're having issues, you can follow
        <a
          @click.prevent="openInBrowser"
          href="https://support.discord.com/hc/en-us/articles/360004027692-Requesting-a-Copy-of-your-Data"
          class="links"
          >this link</a
        >. It will walk you through all the steps necessary to request your data package. Once it's
        requested, keep in mind that it will take a few days for Discord to send you the data (you
        will get an email confirmation with the download link once it's ready).
      </p>
      <p>
        When all of this is done, you're only one step away from getting all your data statistics!
        Simply go back to the home menu and upload the zip file you just downloaded.
      </p>
      <p>
        Keep in mind that the reason why you need to download the data package from Discord itself
        is because the app only works on your computer, no funny business or any servers related
        that might collect your data, making it completely offline.
      </p>
      <h1>About the project</h1>
      <p>
        I started this project after being told by a friend that you could download your Discord
        data of everything that you ever did in nice computer friendly formats, and it made me think
        "why not build something that might show people statistics?", and here I am now. As stated
        before, the application is completely offline (I put a strong emphasis on privacy, hence why
        the code is also open-source), so you can feel safe about having your data processed by this
        application.
      </p>
      <p>
        Anyways, thanks for using it! I hope you could get some value out of it. If you want to buy
        me a coffee or support the development (or my other side projects), I have a
        <a @click.prevent="openInBrowser" href="https://ko-fi.com/nezia">ko-fi account</a>!
      </p>
    </article>
  </main>
</template>

<script>
  export default {
    name: 'HowTo',
    methods: {
      openInBrowser(e) {
        require('electron').shell.openExternal(e.target.href)
      },
    },
  }
</script>

<style scoped>
  .container {
    align-items: flex-start;
    padding: 0 20%;
    height: auto;
  }

  .explanation {
    font-family: 'Whitney';
    font-weight: normal;
  }

  a {
    color: #5865f2;
  }
</style>
