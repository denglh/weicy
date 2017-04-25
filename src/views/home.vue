<template>
    <div class="page-home">
        <page-header :title="'请选择餐段进行点餐'"></page-header>

        <div class="item">
            <div class="title">今天（2016-07-04）</div>
            <ul>
                <li><a href="#">今日早餐<br>送餐时间<br>06:00-09:00</a></li>
                <li class="active"><a v-link="{ name: 'canteen', query: { canteenID: 1000, display: 'list' }}">今日午餐<br>送餐时间<br>06:00-09:00</a></li>
                <li><a v-link="{ name: 'canteen', query: { canteenID: 1000, display: 'img' }}">今日晚餐<br>送餐时间<br>06:00-09:00</a></li>
            </ul>
        </div>
        <div class="item">
            <div class="title">明天（2016-07-05）</div>
            <ul>
                <li><a href="#">明日早餐<br>送餐时间<br>06:00-09:00</a></li>
                <li><a href="#">明日午餐<br>送餐时间<br>06:00-09:00</a></li>
                <li><a href="#">明日晚餐<br>送餐时间<br>06:00-09:00</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import { setWeixin } from '../vuex/actions.js'
    export default {
        components: {
            PageHeader
        },
        vuex: {
            actions: {
                setWeixin
            }
        },
        route: {
            data () {
                var self = this
                //微信SDK验证
                /*self.$http.post('merchant.json', { id: self.$route.params.id }).then((response) => {
                    const merchant = JSON.parse(response.data)
                    setWeixin(JSON.parse(response.data))
                    return self.showloading = false
                }, (response) => {
                    // error callback
                });*/
            }
        },
    }
</script>
