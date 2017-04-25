<template>
    <div class="attr" transition="bounce">
        <div class="name">[{{product.fid}}]{{product.title}}</div>
        <ul class="counter-height">
            <li class="min-list clearfix" v-for="p in attrs">
                <span class="title">[{{p.cid}}-{{p.fid}}-{{p.aid}}] {{ p.title }}</span>
                <span class="price">{{ p.price | currency '￥'}}</span>
                <span class="counter">
                    <counter :product="p" :parent="product"></counter>
                </span>
            </li>
        </ul>
        <div class="btn clearfix">
            <button class="btn-cancel" v-tap="showCart">取消</button>
            <button class="btn-entry" v-tap="showCart">确定</button>
        </div>

    </div>
</template>

<script>
    import Counter from './counter.vue'
    import { showCart, setAttrs } from '../vuex/actions.js'
    import { getProduct, getAttrs } from '../vuex/getters.js'
    export default {
        components: { Counter },
        vuex: {
            getters: {
                product: getProduct,
                attrs: getAttrs,
            },
            actions: {
                showCart, setAttrs,
            }
        },
        ready() {
            this.setAttrs(this)
        },
    }
</script>


