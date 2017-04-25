export default (router) => router.map({
    '/': {
        name: 'index',
        component: require('./views/home'),
    },
    '/canteen/': {
        name: 'canteen',
        component: require('./views/product-list.vue'),
    },
    /*'/canteenImg/': {
        name: 'canteenImg',
        component: require('./views/product-list-img.vue'),
    },*/
    '/canteen/detail/': {
        name: 'detail',
        component: require('./views/product-detail.vue'),
    },
    '/merchant/': {
        name: 'merchant',
        component: require('./views/merchant.vue'),
    },
    //会员中心
    '/user/': {
        name: 'user',
        component: require('./views/user.vue'),
    },
    '/info/': {
        name: 'info',
        component: require('./views/info.vue'),
    },
    //商家
    '/members/': {
        name: 'members',
        component: require('./views/members.vue'),
    },
    //收货地址
    '/address/': {
        name: 'address',
        component: require('./views/address.vue'),
    },
    //预定
    'reserve': {
        name: 'reserve',
        component: require('./views/reserve.vue'),
    },
    //订单
    '/orderconfirm/': {
        name: 'orderConfirm',
        component: require('./views/order-confirm.vue'),
        subRoutes: {
            '/': {
                component: {
                    template: '<p class="tip">请选择支付方式！</p>'
                }
            },
            '/result/': {
                name: 'result',
                component: require('./views/order-confirm-child.vue')
            },
        }
    },
    '/order/': {
        name: 'order',
        component: require('./views/order.vue'),
    },
    '/order/detail/': {
        name: 'orderDetail',
        component: require('./views/order-detail.vue'),
    },
    '*': {
        component: require('./views/404'),
    },
});

