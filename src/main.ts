import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import App from './App.vue'
import './index.less'

import store from "../packages/store"
import router from "./router/index"
import setup from "./setup/index";

export const app = createApp(App);

app.use(Antd);
app.use(store);
app.use(router);
app.use(setup);

app.mount('#app');

