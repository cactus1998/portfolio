// main.js
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' 

import zhTw from "element-plus/dist/locale/zh-tw.mjs";

const app = createApp(App)

app.use(ElementPlus, { locale: zhTw });
app.mount('#app')