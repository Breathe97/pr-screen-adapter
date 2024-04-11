import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import PrScreenAdapter from '../../dist/index.js'

const app = createApp(App)

app.use(PrScreenAdapter)

app.mount('#app')
