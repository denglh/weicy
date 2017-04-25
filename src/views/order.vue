<!-- 用户中心 -->
<template>
    <div class="page-order">

        <page-header :title="'我的订单'"></page-header>

        <section class="wrap" v-updataorderlist="ifUpdate">
            <ul class="order-list">
                <li class="clearfix" v-for="o in orders" v-tap="gotoOrderDetail(o.oid)"  >
                    <div class="left">
                        <em class="state f12" :class="{'none-pay': o.state==='未支付'}" v-text="o.state"></em>
                        <span class="title f14">
                            {{o.title}}
                        </span><br>
                        <span class="time" v-text="o.time | formatdate 'yyyy-MM-dd hh:mm:ss'"></span>
                    </div>
                    <div class="right">
                        <span class="price" v-text="o.price | currency '￥'"></span>
                        <i class="icon icon-keyboard_arrow_right f20 gray"></i>
                    </div>
                </li>
                <li class="more">加载更多...</li>
            </ul>

        </section>

        <toast :toast="toast"></toast>

    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Toast from '../components/toast.vue'

    import { setToast, setOrderList } from '../vuex/actions.js'
    import { getToast } from '../vuex/getters.js'
    import { isTouch } from '../vuex/utils.js'

    export default {
        data(){
            return {
                total: 0,
                page: 1,
                limt: 10,
                orders: [],
                ifUpdate: true,
                ajaxload: true,
            }
        },
        components: { PageHeader, Toast },
        methods: {
            loadMore(){
                this.ifUpdate = true
            },
            gotoOrderDetail(id){
                this.$route.router.go({
                    name: 'orderDetail',
                    //params 和 query 可选
                    query: { 'id': id },
                    //query: { ... },
                    append: true
                })
            }
        },
        vuex: {
            getters: {
                toast: getToast,
            },
            actions: {
                setToast, setOrderList
            }
        },
        directives:{
            twoWay: true,
            updataorderlist: function(val, oldVal){
                if(!val){
                    return;
                }
                var self = this.vm
                self.setToast({show: true, text: '加载中'})
                self.setOrderList((response)=>{
                    self.total = response.total
                    self.page = response.page
                    self.orders = self.orders.concat(response.list)
                    self.ifUpdate = false
                    self.ajaxload = true
                })
            }
        },
        ready(){
            //上拉加载列表
            const self = this
            const pageHeight = document.documentElement.clientHeight
            document.querySelector(".wrap").style.height = pageHeight - 51 + 'px'
            const outHeight = pageHeight - 51
            let eMove = isTouch ? 'touchmove'   : 'scroll'
            $(document).on(eMove, '.wrap', function(){
                const inHeight = $(this).find('ul').height()
                const stop = $(this).scrollTop();
                console.log(outHeight, inHeight, stop)
                if( self.ajaxload && inHeight > outHeight && stop + outHeight > inHeight - 10 ) {
                    console.log('loading more...')
                    self.ajaxload = false
                    self.ifUpdate = true
                }
            });
        }
    }
</script>

