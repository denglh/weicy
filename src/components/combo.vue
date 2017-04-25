<template>
    <div class="attr combo" transition="bounce">
        <div class="name">[{{uuid}}-{{product.fid}}]-[{{product.type == '4' ? '组合':'固定' }}]{{product.title}} -- <span v-text="curCombo.price | currency '￥'"></span></div>
        <ul class="combo-product-list counter-height">
            <li class="clearfix" v-for="p in comboPost.rows">
                <dl>
                    <dt class="title">{{ p.title }} ({{p.require > 0 ? p.foods.length + ' 选 ' + p.require : '不限制选择个数'}})</dt>
                    <dd v-for="t in p.foods"
                    :class="{ 'active': isSelected(t)}"
                    v-tap="selectComboFood(p, t)">
                        [{{t.fid}}]
                    </dd>
                </dl>
            </li>
        </ul>
        <div class="btn clearfix">
            <button class="btn-cancel" v-tap="onCancel">取消</button>
            <button class="btn-entry" v-tap="onEntry">确定</button>
        </div>

    </div>
</template>

<script>
    import { showCart, setCombo, addCombo, escCombo, selectComboFood } from '../vuex/actions.js'
    import { getProduct, getCombo, getComboSelected, getCurrentCombo } from '../vuex/getters.js'
    import { reGrouping } from '../vuex/utils.js'
    export default {
        data(){
            return {
                uuid: this.curCombo.uuid!='' ? this.curCombo.uuid : Math.random().toString(36).substring(3, 8),
                price: 0,
            }
        },
        vuex: {
            getters: {
                product: getProduct,
                comboPost: getCombo,        //ajax返回的套餐内容 02008163784@163.gd
                curCombo: getCurrentCombo,
                selected: getComboSelected,
            },
            actions: {
                showCart, setCombo, addCombo, escCombo, selectComboFood,
            }
        },
        methods: {
            onCancel(){
                this.showCart()
                this.escCombo()
            },
            //生成套餐
            onEntry(){
                this.showCart()
                this.addCombo(this.product, this.uuid)
            },
            //标记套餐内选中的菜品
            isSelected(food){
                let ischecked = false, self = this
                if(food.selected > 0) ischecked = true;
                if(this.selected.indexOf(food.fid)!=-1) ischecked = true
                return ischecked;
            }
        },
        ready() {
            this.setCombo(this)
        },
    }
</script>


