import { createApp } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

import App from './App.vue'
createApp(App).mount('#app')
