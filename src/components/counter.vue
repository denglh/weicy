<template>
    <div v-bind:class="{ 'type-attr': product.type=='2', 'type-combo': product.type == '3' || product.type == '4', 'open': !!product.quantity }">
        <span class="cut" v-tap="cutQuantity(product, parent)"><i class="icon icon-circle-minus"></i></span>
        <span class="number">{{product.quantity}}</span>
        <span class="add" v-tap="addQuantity(product, parent)" v-html="text"></span>
    </div>
</template>
<script>
    import { cutQuantity, addQuantity } from '../vuex/actions.js'

    export default {
        data(){
            return {
                text: this.product.type==='2' ? '<em>选规格</em>' : '<i class="icon icon-circle-plus"></i>'
            }
        },
        props: ['product', 'parent'],
        vuex: {
            actions: {
                cutQuantity, addQuantity
            }
        },
    }
</script>