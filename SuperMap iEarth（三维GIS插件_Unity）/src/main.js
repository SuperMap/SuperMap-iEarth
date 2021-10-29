import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
//naive-ui
import naiveUI from '@/js/plugins/naive-ui'
app.use(naiveUI)

//游戏引擎封装组件库
import GEcomps from 'vue-gis-ge'
app.use(GEcomps)

//iEarth ui界面组件
import "@/styles/index.scss"
import comps from '@/components/index'
app.use(comps)

app.mount('#app')

