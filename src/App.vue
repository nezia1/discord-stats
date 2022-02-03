<template>
  <main class="app">
    <nav class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/how-to">How To</router-link>
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

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  :root {
    font-size: clamp(16px, 1vw, 24px);
    font-family: 'Uni Sans';
  }

  .app {
    display: grid;
    grid-template-rows: 5% auto 5%;
    background-color: #36393f;
    width: 100vw;
    height: 100vh;
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
