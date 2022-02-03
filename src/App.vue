<template>
  <main class="app">
    <nav class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </main>
</template>

<style>
  @font-face {
    font-family: 'Uni Sans';
    src: url('~@/assets/fonts/uni-sans/Uni Sans Heavy.otf');
    font-display: auto;
    font-style: normal;
  }

  @font-face {
    font-family: 'Whitney';
    src: url('~@/assets/fonts/whitney/whitneymedium.otf');
    font-display: auto;
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: 'Whitney';
    src: url('~@/assets/fonts/whitney/whitneysemibold.otf');
    font-display: auto;
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: 'Whitney';
    src: url('~@/assets/fonts/whitney/whitneybold.otf');
    font-display: auto;
    font-style: normal;
    font-weight: 900;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  :root {
    font-size: clamp(16px, 1vw, 24px);
    font-family: 'Uni Sans';
    color: white;
  }

  .app {
    display: grid;
    grid-template-rows: 5% auto 5%;
    background-color: #36393f;
    width: 100vw;
    min-height: 100vh;
  }

  .nav {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .nav a {
    color: white;
    text-decoration: none;
  }

  .nav a.router-link-exact-active {
    color: #5865f2;
  }
</style>
