<template>
    <div class="page-orderConfirm">
        <page-header :title="'提交订单'"></page-header>
        <section class="wrap" v-updataorderconfirm="ifUpdate">
            <div class="address" v-else>
                <h2>收货地址</h2>
                <div class="info" v-if="address.type === 0" v-tap="changeAddress('0')">
                    <span class="f14">添加收货地址</span>
                    <i class="icon icon-keyboard_arrow_right"></i>
                </div>
                <div class="info f14" v-if="address.type === 1" v-tap=changeAddress('1')>
                    <span class="name f14" v-text="address.name"></span>
                    <span class="mobile f14" v-text="address.mobile"></span>
                    <div class="detail" v-text="address.location"></div>
                    <i class="icon icon-keyboard_arrow_right"></i>
                </div>
            </div>
            <div class="people">
                <h2>茶位费<span class="tip">若已下单需要加菜，请选择 0</span></h2>
                <popup-picker title="【商户名】就餐人数（￥5/人）" :columns="1" :value.sync="peopleDef" :list="people" :unit="peopleUnit" placeholder=""></popup-picker>
            </div>

            <div class="pay-type">
                <h2>支付方式<span class="tip" v-show="paytip">请选择支付方式！</span></h2>
                <ul>
                    <li :class="{'active': $index === selected, 'oneline': !p.reduction}" v-for="p in payType" v-tap="changePayType(p.id, $index)">
                        <i class="icon icon-check_circle"></i>
                        <span class="name">{{p.name}} {{(p.id === 3 ? '(支持刷卡、现金等)' : '')}}</span>
                        <span class="small" v-if="p.reduction">{{p.reduction.title}} ，限满减菜品</span>
                    </li>
                </ul>
            </div>



            <div class="content">
                <h2>订单菜品</h2>
                <router-view :result.sync="result" :post-data.sync="postData" :if-updata.sync="ifUpdate"></router-view>
            </div>
            <div class="remark clearfix">
                <h2>订单备注</h2>
                <textarea placeholder="还有什么需要说明的？没有可不填"></textarea>
            </div>
            <div class="footer">
                <div class="total">
                    <span class="all">总计 <em class="f14 number" v-text="money | currency '￥'"></em></span><br>
                    <span class="yh">( 已优惠 <em class="f14 number" v-text="couponmoney | currency '￥'"></em> )</span>
                </div>
                <button class="btn"
                    :class="{ 'disabled': postData.address==='' || postData.payType === ''  }"
                    v-tap="goPay">去支付</button>
            </div>
        </section>
        <toast :toast="toast"></toast>
    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Toast from '../components/toast.vue'
    import popupPicker from '../components/popup-picker.vue'

    import { setToast, setAddress, setPayway, setOrderConfirmFoods } from '../vuex/actions.js'
    import { getAddress, getToast } from '../vuex/getters.js'

    export default {
        components: { PageHeader, Toast, popupPicker },
        data(){
            return {
                payType: [],
                result: {
                    'foods': {
                        'cid': '',
                        'did': '',
                        'name': '',
                        'day': '',
                        'list': []
                    },
                    'coupons': [],
                    'reduction': []
                },
                postData: {
                    address: '',
                    payType: '',
                    coupon: {id: '', price: 0}
                },
                selected: Number,
                money: 0,
                couponmoney: 0,
                ifUpdate: true,
                paytip: true,
                people: [[1,2,3,4,5,6,7,8,9,10,11,12]],
                peopleDef: [],
                peopleUnit: ['人'],
            }
        },

        methods: {
            total () {
                var self = this
                self.money = 0
                self.couponmoney = self.postData.coupon.price
                self.result.foods.list.forEach((p) => {
                    self.money +=  p.price * p.quantity
                })
                self.money = self.money - self.couponmoney
            },
            loadMore(){
                this.ifUpdate = true
            },
            changePayType(id, index){
                this.selected = index
                this.paytip = false
                console.log("支付方式：", id);
                if(id == this.postData.payType) return;
                this.postData.payType = id
                this.ifUpdate = true
                this.$route.router.go({
                    name: 'result',
                    //params 和 query 可选
                    //params: { 'id': id },
                    //query: { ... },
                    append: true
                })
            },
            goPay() {

            },
            changeAddress(type) {
                this.$route.router.go({
                    name: 'address',
                    //params 和 query 可选
                    query: { 'type': type },
                })
            },
        },
        vuex: {
            getters: {
                address: getAddress,
                toast: getToast,
            },
            actions: {
                setToast, setAddress, setPayway, setOrderConfirmFoods,
            }
        },
        directives:{
            twoWay: true,
            updataorderconfirm: function(val, oldVal){
                if(!val){
                    return;
                }
                var self = this.vm
                self.setOrderConfirmFoods(self)
            }
        },
        route: {
            data(){
                var self = this
                self.setToast({show: true, text: '加载中'})
                self.setAddress(self)
                self.setPayway(self)
                /*let time = 3
                const t = setInterval(() => {
                    if (time <= 0) {
                        clearInterval(t);
                        self.paytip = false
                        return;
                    }
                    time -= 1;
                }, 1000);*/
            }
        },
        watch: {
            address: function(val) {
                this.postData.address = val
            }
        },
        ready(){
        }
    }
</script>