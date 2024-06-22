import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import Clicker from './utils/Clicker'

const clicker = new Clicker({
    url: 'localhost:8000',
    token: Telegram.WebApp.initData,
    schema: 'public'
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

export default clicker
