import { createApp } from 'vue'
import { createStore } from 'vuex'

import user from './modules/user'
import role from './modules/role'

const store = createStore({
  modules: {
    user,
    role
  }
})

export default store;
