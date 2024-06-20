<script setup>
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/upgades">Upgrades</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style>
  body {
      background-color: var(--tg-theme-bg-color);
  }

  button {
    background: var(--tg-theme-button-color);
    color: var(--tg-theme-button-text-color);
  }

  div {
      color: var(--tg-theme-text-color);
  }
</style>