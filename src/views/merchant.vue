<!-- 商家 -->
<template>
    <div class="page-merchant">

        <page-header :title="name"></page-header>

        <section class="wrap clearfix">
            <dl class="intro">
                <dd>
                    <a href="#" v-tap.prevent="scanQRCode">堂食</a>
                    <a v-link="{ name: 'index', params: { id: 123 }}">外卖</a>
                    <a v-link="{ name: 'reserve', params: { id: 123 }}">预定</a>
                </dd>
            </dl>

            <dl class="notice" v-if="notice.length">
                <dt>点餐公告</dt>
                <dd class="clearfix" v-for="item in notice" v-tap="showNotice(item, $event)">
                    <span class="left">{{item}}</span>
                    <span class="right f20 gray"><i class="icon icon-keyboard_arrow_right"></i></span>
                </dd>
            </dl>

            <dl class="info">
                <dt>商家信息</dt>
                <dd>
                    <ul>
                        <li>地址：<span v-text="address"></span></li>
                        <li>手机：<span v-text="mobile"></span></li>
                    </ul>
                </dd>
            </dl>
        </section>

        <modal v-bind:modal="modal"></modal>

        <mask></mask>

        <toast :toast="toast"></toast>

    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Modal from '../components/modal.vue'
    import Mask from '../components/mask.vue'
    import Toast from '../components/toast.vue'

    import { getWeixin, getModal, getToast } from '../vuex/getters.js'
    import { setModal, setToast, setMerchant } from '../vuex/actions.js'
    export default {
        data(){
            return {
                showloading: true,
                name: '',
                notice: [],
                address: '',
                mobile: '',
            }
        },
        components: { PageHeader, Modal, Mask, Toast },
        vuex: {
            getters: {
                weixin: getWeixin,
                modal: getModal,
                toast: getToast,
            },
            actions: {
                setModal, setToast, setMerchant,
            }
        },
        methods: {
            scanQRCode(){
                console.log("扫码点餐", wx)
                const self = this
                self.setModal({
                    show: true,
                    title: '提示',
                    content: '堂食点餐，请扫码桌子上的二维码。',
                    cancelText: '取消',
                    confirmText: '扫码点餐',
                    cancel: (obj) => {
                        self.setModal({ show: false})
                    },
                    confirm: (obj) => {
                        console.log("确定", obj.$el)
                        self.setModal({ show: false})
                        wx.ready(function () {
                            wx.scanQRCode({
                                needResult: 0,
                                scanType: ["qrCode","barCode"],
                                success: function (res) {
                                    var result = res.resultStr
                                }
                            })
                        })
                    }
                })
            },
            reserve(){
                this.setModal({
                    show: true,
                    title: '提示',
                    content: '暂未开放预定功能！',
                    cancelText: '',
                    confirmText: '确定',
                    cancel: ()=>{this.setModal({ show: false})},
                    confirm:()=>{this.setModal({ show: false})},
                })
            },
            showNotice(text, event){
                this.setModal({
                    show: true,
                    title: '公告',
                    content: event.target.textContent,
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
                self.setMerchant((response)=>{
                    self.name = response.name
                    self.notice = response.notice
                    self.address = response.address
                    self.mobile = response.mobile
                    self.setToast({show: false})
                })
            }
        },
        ready(){
            wx.config({
                debug: true,
                appId: this.weixin.appId,
                timestamp: this.weixin.timestamp,
                nonceStr: this.weixin.nonceStr,
                signature: this.weixin.signature,
                jsApiList: [
                    "onMenuShareTimeline",
                    "scanQRCode"
                ]
            })
        },
    }
</script>

