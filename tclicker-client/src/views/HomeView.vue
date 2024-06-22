<script setup>
  import { ref } from 'vue'
  import clicker from '@/main'
  import { useUserStore } from '@/stores/user'

  const user_store = useUserStore()

  const isBtnDisabled = ref(false)

  clicker.sync().then(async res => {
      if(res.status == '200') {
        const body = await res.json()
        user_store.user = body.user
        init()
    }
  });

  async function init() {
    setInterval(async () => {
      user_store.user = (await clicker.sync().then(res => res.json())).user
    }, 30000)

    setInterval(async () => {
      if( user_store.user.available_clicks <  user_store.user.max_available_clicks) user_store.user.available_clicks++
      if( user_store.user.available_clicks > 0) isBtnDisabled.value = false
      user_store.user.clicks_count = Number(user_store.user.clicks_count) + user_store.user.clicks_per_ms / user_store.user.ms_to_clicks
    }, 1 / user_store.user.ms_to_clicks)

    Telegram.WebApp.expand()

    Telegram.WebApp.ready()
  }

  function click() {
    Telegram.WebApp.HapticFeedback.impactOccurred('light')
    user_store.user.available_clicks--
    user_store.user.clicks_count = Number(user_store.user.clicks_count) + Number(user_store.user.clicks_ratio)
    if( user_store.user.available_clicks == 0) isBtnDisabled.value = true
    localStorage.setItem('clicks', Number(localStorage.getItem('clicks')) + 1)
  }
</script>

<template>
  <div class="available_clicks">{{user_store.user.available_clicks}}</div>
  <div class="max_available_clicks">{{user_store.user.max_available_clicks}}</div>
  <button :disabled="isBtnDisabled" class="btn" v-on:click="click">{{user_store.user.clicks_count}}</button>
</template>

<style>
  .btn {
    height: 300px;
    width: 300px;
    border-radius: 50%;

    position: absolute;
    top:  50vh;
    left: 50vw;
    transform: translate(-50%,-50%);
  }
</style>