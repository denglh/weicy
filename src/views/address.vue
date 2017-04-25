<template>
    <div class="page-address">
        <page-header :title="pageTitle"></page-header>
        <section class="wrap" v-updataloaction="ifUpdate">
            <div class="address change-address">
                <dl class="intro">
                    <dt>修改收货信息</dt>
                    <dd class="clearfix">
                        <label for="">称呼</label>
                        <input type="text" name="text" v-model="name" :value="address.name" placeholder="怎么称呼您？">
                    </dd>
                    <dd class="clearfix">
                        <label for="">手机</label>
                        <input type="tel" name="tel" v-model="mobile" :value="address.mobile" placeholder="能让配餐员快速送餐到您的手上">
                    </dd>
                </dl>
                <dl class="location">
                    <dt>送达位置</dt>
                    <dd v-for="item in location">
                        <select id="deep-{{$index}}" @change="getlocation($index, $event)">
                            <option v-for="o in item" value="{{o.id}}">{{o.title}}</option>
                        </select>
                    </dd>
                    <dd v-show="showDetail">
                        <label for="">地址</label>
                        <input type="text" name="text" v-model="detail" :value="" placeholder="详细地址">
                    </dd>
                </dl>
                <button class="btn">确定</button>
            </div>
        </section>
        <toast :toast="toast"></toast>
    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Toast from '../components/toast.vue'

    import { setToast, setAddress, setLocation } from '../vuex/actions.js'
    import { getAddress, getToast } from '../vuex/getters.js'

    export default {
        data(){
            return {
                pageTitle: '',
                name: '',
                mobile: '',
                location: [],
                lid: '0',
                showDetail: false,
                ifUpdate: true,
            }
        },
        components: { PageHeader, Toast },
        methods: {
            getlocation(deep, event){
                this.lid = event.target.value
                this.ifUpdate = true
                console.log(this.lid)
            }
        },
        vuex: {
            getters: {
                address: getAddress,
                toast: getToast,
            },
            actions: {
                setToast, setAddress, setLocation,
            }
        },
        directives:{
            twoWay: true,
            updataloaction: function(val, oldVal){
                if(!val){
                    return;
                }
                var self = this.vm
                console.log("-----------",self.lid)
                self.setLocation(self, (response)=>{
                    console.log("list", response.list)
                    self.location.push(response.list)
                    self.ifUpdate = false
                })
            }
        },
        route: {
            data(){
                var self = this
                self.setToast({show: true, text: '加载中'})
                self.pageTitle = self.$route.query.type === "1" ? '修改收货信息' : '新增收货地址'
                self.setAddress(self)
            }
        },
    }
</script>