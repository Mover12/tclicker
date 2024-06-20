import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import Clicker from './utils/Clicker'
  
const clicker = new Clicker({
    url: 'https://unrivaled-bublanina-2e9c1b.netlify.app:8000',
    token: Telegram.WebApp.initData
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

export default clicker
