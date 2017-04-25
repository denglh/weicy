
<template>
    <div class="cart">
        <div class="cart-wrap" v-show="showCart" transition="bounce">
            <div class="cart-header">
                <span class="title">购物车</span>
                <span class="close" v-tap="toggleShowCart"><i class="icon icon-close"></i></span>
            </div>
            <p class="no-product" v-show="!cart.length"><i>空空如也，快去添加商品吧！~</i></p>

            <div class="cart-list">
                <dl v-for="cat in cartList">
                    <dt>{{cidToName(cat[0].cid)}}</dt>
                    <dd v-for="p in cat" class="clearfix">
                        <ul v-if="p.combos!==undefined">
                            <li class="min-list clearfix" v-for="combo in p.combos">
                                <span class="title" >[{{p.cid}}-{{p.fid}}-{{combo.uuid}}] {{{ getCartTitle(p, combo) }}}</span>
                                <span class="price" v-text="combo.price | currency '￥'"></span>
                                <span class="counter">
                                    <counter :product="combo"></counter>
                                </span>
                                <span class="del hide">
                                    <button v-tap="delProduct(p)">x 删除</button>
                                </span>
                            </li>
                        </ul>
                        <div class="min-list clearfix" v-else>
                            <span class="title" >[{{p.cid}}-{{p.fid}}-{{p.aid}}] {{ getCartTitle(p) }}</span>
                            <span class="price" v-text="p.price | currency '￥'"></span>
                            <span class="counter">
                                <counter :product="p"></counter>
                            </span>
                            <span class="del hide">
                                <button v-tap="delProduct(p)">x 删除</button>
                            </span>
                        </div>
                    </dd>
                </dl>
            </div>
        </div>
        <div class="total clearfix">
            <div class="info" v-tap="toggleShowCart">
                <span class="ret" :class="{'disabled': !cart.length}"><i class="icon icon-add_shopping_cart"></i><em class="number f14 green" v-text="quantity"></em></span>
                <span class="price" v-text="total | currency '￥'"></span>
            </div>
            <button class="btnBuy" :class="{ 'disabled': !cart.length}" :disabled="!cart.length" v-tap="checkout">提交购物车</button>
        </div>
    </div>
</template>

<script>
    import Counter from './counter.vue'
    import { cutQuantity, addQuantity, delProduct, setMask, toggleCart } from '../vuex/actions.js'
    import { getCart, getShowCart,getGenres } from '../vuex/getters.js'
    import { reGrouping } from '../vuex/utils.js'
    export default {
        components: { Counter },
        data(){
            return {
                cartList: {},
            }
        },
        vuex: {
            getters: {
                genres: getGenres,
                cart: getCart,
                showCart: getShowCart,
            },
            actions: {
                cutQuantity,
                addQuantity,
                delProduct,
                setMask,
                toggleCart,
            }
        },
        computed: {
            total: function () {
                return this.cart.reduce((total, p) => {
                    if(p.combos.length) {
                        return p.combos.reduce((t, c)=>{
                            return t + c.price * c.quantity
                        }, 0)
                    }else{
                        return total + p.price * p.quantity
                    }

                }, 0)

            },
            quantity: function(){
                return this.cart.reduce((total, p) => {
                    return total + p.quantity
                }, 0)
            }
        },
        methods: {
            toggleShowCart(){
                var self = this
                if(self.showCart) {
                    self.isShowCart = false
                    self.toggleCart(false)
                    self.setMask(false)
                }else{
                    self.isShowCart = true
                    self.toggleCart(true)
                    self.setMask(true)
                }
            },
            checkout(){
                this.$route.router.go({
                    name: 'result',
                    //params 和 query 可选
                    //params: { 'id': id },
                    //query: { ... },
                    append: true
                })
            },
            //根据菜品所属cid生成对应分类名称
            cidToName(cid){
                const genresObj = this.genres.find( g => g.cid === cid)
                if(!!genresObj) return genresObj.title
            },
            //在购物车中生成标题
            getCartTitle(product, combo){
                let title = product.title, comboTitle = []
                if(!!product.aid) {
                    title = product.parentTitle + '—（' + product.title + '）'
                }else if(product.combos!== undefined && product.combos.length && combo) {
                    combo.list.forEach((p) => { p.foods.forEach( f => comboTitle.push(f.title)) } )
                    title = product.title + '<br>' + comboTitle.join('+')
                }else{
                    title = product.title
                }
                return title
            },
        },
        ready(){
            this.cartList = reGrouping('cid', this.cart)

            let height = 0
            let ret = document.querySelector('.ret')
            const t = setInterval(() => {
                if (height >= 330) {
                    height = 0
                    //clearInterval(t);
                    //return;
                }
                height+=1;
                ret.style.backgroundPositionY = -height + 'px'
            }, 50);
            console.log("购物车分组：",this.cartList)
        }
    }
</script>

<style lang="less">
.bounce-transition {
    display: block; /* 否则 scale 动画不起作用 */
}
.bounce-enter {
    animation: bounce-in .35s;
}
.bounce-leave {
    animation: bounce-out .35s;
}
@keyframes bounce-in {
    0% { transform: translateY(100%);}
    100% { transform: translateY(0);}
}
@keyframes bounce-out {
    0% {transform: translateY(0);}
    100% {transform: translateY(100%);}
}
.element-animation{
    animation: animationFrames linear 0.8s;
    animation-iteration-count: 1;
    transform-origin: 50% 50%;
}
@keyframes animationFrames{
    0% {
        transform:  translate(0px,0px)  ;
    }
    15% {
        transform:  translate(0px,-10px)  ;
    }
    30% {
        transform:  translate(0px,0px)  ;
    }
    75% {
        transform:  translate(0px,-5px)  ;
    }
    100% {
        transform:  translate(0px,0px)  ;
    }
}
</style>