<!-- 商家 -->
<template>
    <div class="page-reserve">

        <page-header :title="name"></page-header>

        <section class="wrap clearfix">

            <p class="tip" v-tap="showNotice()">当前支持3天内预定，请录入预定相关信息</p>

            <div class="form">


                <popup-picker title="收货地址" genre="address" :columns="3" :value.sync="value" :list="addressData" placeholder="省/市/区"></popup-picker>

                <popup-picker title="预定时间" genre="dataTime" :columns="2" :unit="dateTimeUnit" :value.sync="vTime" placeholder="年/月/日"></popup-picker>

                <popup-picker title="选择人数" :columns="1" :value.sync="vpeople" :list="people" placeholder="人"></popup-picker>

                <div class="item clearfix">
                    <label for="user">姓名</label>
                    <input id="user" v-model="user" type="text" placeholder="姓名">
                </div>
                <div class="item clearfix">
                    <label for="mobile">手机</label>
                    <input id="mobile" v-model="mobile" type="phone" placeholder="手机号码">
                </div>
                <div class="item clearfix">
                    <label for="num">人数</label>
                    <input id="num" v-model="num" type="number" placeholder="人数">
                </div>
                <div class="item clearfix">
                    <label for="cardid">身份证号码</label>
                    <input id="cardid" v-model="cardid" type="text" placeholder="网吧用户必填，否则无预订">
                </div>
                <button class="btn-postReserve" v-tap="postReserve">马上预定</button>
            </div>
        </section>



        <modal :modal="modal"></modal>

        <mask></mask>

        <toast :toast="toast"></toast>

    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Modal from '../components/modal.vue'
    import Mask from '../components/mask.vue'
    import Toast from '../components/toast.vue'
    import popupPicker from '../components/popup-picker.vue'

    import { getModal, getToast } from '../vuex/getters.js'
    import { setModal, setToast, setReserve } from '../vuex/actions.js'

    import addressData from '../../static/js/address.json'
    export default {
        data(){
            return {
                showloading: true,
                showPicker: false,
                name: '',

                user: '',
                mobile: '',
                num: '',
                cardid: '',

                addressData: addressData,

                value:  ["430000",  "430400", "430421"],
                vTime: [],
                dateTimeUnit: ['年','月','日'],
                people: [[1,2,3,4,5,6,7,8,9,10,11,12]],
                vpeople: [6]
            }
        },
        components: { PageHeader, Modal, Mask, Toast, popupPicker, },
        vuex: {
            getters: {
                modal: getModal,
                toast: getToast,
            },
            actions: {
                setModal, setToast, setReserve,
            }
        },
        methods: {
            postReserve(){

            },
            showNotice(){
                this.setModal({
                    show: true,
                    title: '公告',
                    content: '测试',
                    cancelText: '',
                    confirmText: '确定',
                    cancel: ()=>{this.setModal({ show: false})},
                    confirm:()=>{this.setModal({ show: false})},
                })
            },
        },
        route: {
            data () {
                var self = this
                self.setToast({show: true, text: '加载中'})
                self.setReserve((response)=>{
                    self.name = response.name
                    self.setToast({show: false})
                })
            }
        },

        ready(){

        },
    }
</script>

