<template>
    <div class="page-orderDetail">
        <page-header :title="'订单详情'"></page-header>

        <section class="wrap">
            <dl class="intro">
                <dt>基本信息</dt>
                <dd v-for="item in info">
                    <label for="" v-text="item.name+'：'"></label>
                    <span v-text="item.val"></span>
                </dd>
            </dl>
            <dl class="foods">
                <dt v-text="foods.title"></dt>
                <dd v-for="item in foods.list">
                    <span class="name" v-text="item.name"></span>
                    <span class="price" v-text="item.price | currency '￥'"></span>
                    <span class="quantity" v-text="'x'+item.quantity"></span>
                </dd>
            </dl>
        </section>

        <toast :toast="toast"></toast>
    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Toast from '../components/toast.vue'

    import { setToast, setOrderDetail } from '../vuex/actions.js'
    import { getToast } from '../vuex/getters.js'
    export default {
        data(){
            return {
                showloading: true,
                info: [],
                foods: [],
            }
        },
        components: { PageHeader, Toast },
        vuex: {
            getters: {
                toast: getToast,
            },
            actions: {
                setToast, setOrderDetail
            }
        },
        route: {
            data(){
                var self = this
                self.setToast({show: true, text: '加载中'})
                self.setOrderDetail((response)=>{
                    self.info = response.info
                    self.foods = response.foods
                    self.setToast({show: false})
                })
            }
        }
    }
</script>

