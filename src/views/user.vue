<!-- 用户中心 -->
<template>
    <div class="page-user">

        <page-header :title="'个人中心'"></page-header>

        <section class="wrap clearfix">

            <div class="userInfo">
                <div class="avatar"><img src="../../static/images/user.png" alt=""></div>
                <div class="detail">
                    <div class="username">Await</div>
                    <div class="nouser hide">
                        您还不是会员，快去<a v-link="">成为会员</a>吧！
                    </div>
                    <div class="item">
                        <span class="name">会员等级</span>
                        <span class="value">VIP1</span>
                    </div>
                    <div class="item">
                        <span class="name">余额</span>
                        <span class="value number f14 orange">200.00</span>
                    </div>
                    <div class="item">
                        <span class="name">积分</span>
                        <span class="value number f14 orange">50</span>
                    </div>
                </div>
            </div>

            <div class="item">
                <a v-link="{ name: 'order' }">我的订单<i class="icon icon-keyboard_arrow_right"></i></a>
                <a v-link="{ name: 'info' }">我的资料<i class="icon icon-keyboard_arrow_right"></i></a>
            </div>

            <div class="item">
                <dl>
                    <dt>会员储值优惠</dt>
                    <dd><a >充100.00送50.00</a></dd>
                </dl>
            </div>

            <div class="item" v-if="hasICcard">
                <dl class="list">
                    <dt>IC卡</dt>
                    <dd><a v-link="{ name: 'index', params: { id: 123 }}">IC卡查询<i class="icon icon-keyboard_arrow_right"></i></a></dd>
                    <dd><a v-link="{ name: 'index', params: { id: 123 }}">IC卡明细<i class="icon icon-keyboard_arrow_right"></i></a></dd>
                    <dd><a v-link="{ name: 'index', params: { id: 123 }}">IC卡充值<i class="icon icon-keyboard_arrow_right"></i></a></dd>
                </dl>
            </div>

            <div class="item">
                <a v-link="{ name: 'index', params: { id: 123 }}">建议反馈 <i class="icon icon-keyboard_arrow_right"></i></a>
            </div>

            <div class="item">
                <a href="javascript:void(0);">平台加盟热线 <span>135-6038-8008 (许生)</span><i class="icon icon-keyboard_arrow_right"></i></a>
            </div>

            <div class="item">
                <span>Message is: {{ message }}</span>
                    <br>
                    <input class="inputText" type="text" v-model="message" placeholder="edit me">
                    <br>
                    <button class="inputfocus">focus</button><button class="inputblur">blur</button>
            </div>

        </section>

        <modal v-bind:modal="modal"></modal>

        <toast :toast="toast"></toast>

    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Modal from '../components/modal.vue'
    import Mask from '../components/mask.vue'
    import Toast from '../components/toast.vue'

    import { getWeixin, getModal, getToast } from '../vuex/getters.js'
    import { setModal, setToast, setUserCenter } from '../vuex/actions.js'
    export default {
        data(){
            return {
                isUserRank: Number,
                userRankInfo: String,
                hasICcard: Boolean,
            }
        },
        components: { PageHeader, Modal, Toast },
        methods: {
            getCode(v){
                console.log(v)
            }
        },
        vuex: {
            getters: {
                weixin: getWeixin,
                modal: getModal,
                toast: getToast,
            },
            actions: {
                setModal, setToast, setUserCenter
            }
        },
        route: {
            data () {
                var self = this
                self.setToast({show: true, text: '加载中'})
                self.setUserCenter((response)=>{
                    self.isUserRank = response.isUserRank
                    self.userRankInfo = response.userRankInfo
                    self.hasICcard = response.hasICcard
                    self.setToast({show: false})
                })
            }
        },
        ready(){
            $('.inputText').focus()

            $('.inputblur').click(function(){
                //$('.inputText').blur()
                $('.inputText').trigger('blur')
            })
            $('.inputfocus').click(function(){
                $('.inputText').focus()
            })
        }
    }
</script>

