// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookie from 'vue-cookie'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)

router.beforeEach((to, from, next) => {
  // 统计代码
  if (to.path) {
    var _hmt = _hmt || []
    _hmt.push(['_trackPageview', location.pathname + '#/' + to.fullPath])
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
