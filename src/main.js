import { createApp } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
