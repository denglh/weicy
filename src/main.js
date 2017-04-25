import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import configRouter from './routers'
import vueTap from './libs/vue-tap'
import vueLazyimg from './libs/vue-lazyload-img'

Vue.use(vueTap);
Vue.use(vueLazyimg);
Vue.use(VueRouter);

//配置路由
const router = new VueRouter()
configRouter(router)

router.afterEach(function (transition) {
    console.log('成功浏览到: ' + transition.to.path)
})

router.start(Vue.extend(App), '#app');

/*
    popup, address, datetime, dialog, toast, actionsheet, countup, countdown, progress, swiper, scroller
 */