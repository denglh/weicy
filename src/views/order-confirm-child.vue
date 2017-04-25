<template>
    <div class="">
        <div class="title">{{result.foods.name}}({{result.foods.day}})</div>
        <ul v-if="result.foods.list.length">
            <li class="clearfix" v-for="f in result.foods.list" data-cid="10003" data-fid="10791">
                <span class="name"><em v-if="f.reduction">满减</em> {{f.name}} </span>
                <span class="num">x{{f.quantity}}</span>
                <span class="price">{{f.price | currency '￥'}}</span>
                <span class="del" v-tap="delFood(f.fid)"><i class="icon icon-close"></i></span>
            </li>
        </ul>
        <ul v-if="result.coupons.length">
            <li class="coupon">
                <span class="name">优惠卷</span>
                <select id="coupon-select" v-model="selected">
                    <option
                    :selected="$index === 0"
                    v-for="option in result.coupons"
                    :value="{id: option.id, price: option.price}">
                        {{option.name}}
                    </option>
                </select>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                selected: ''
            }
        },
        props: ['result', 'postData', 'ifUpdata'],
        watch: {
            selected: function(val) {
                console.log('ACITON: 设置优惠卷 {id:',val.id,',price:', val.price,'}');
                this.postData.coupon.id = val.id
                this.postData.coupon.price = val.price
                this.ifUpdata = true
            }
        },
        methods: {
            delFood(productID){
                console.log('ACTION: 删除菜品 {fid: ', productID, '}');
                const product  = this.result.foods.list.find(p => p.fid === productID)
                this.result.foods.list.$remove(product)
                this.ifUpdata = true
            }
        }
    }
</script>