<template>
    <div class="combo-list" v-if="!!product.combos && product.combos.length">
        <ul>
            <li v-for="combo in product.combos" track-by="$index">
                <div class="title">
                    <span>[{{combo.uuid}}] - 第 {{ $index+1 }} 份，</span>
                    <span class="number orange">{{combo.price | currency '￥'}}</span>
                    <span class="close" v-tap="delCombo(product, combo.uuid)"><i class="icon icon-close"></i></span>
                </div>
                <div class="content">
                    <div class="item" v-for="p in combo.list">
                        <strong>{{p.title}}：</strong>
                        <span v-for="f in p.foods">{{f.fid}}</span>
                    </div>
                </div>
                <div class="meta">
                    <span v-tap="addComboMore(product, combo)">再来一份</span>
                    <span v-tap="editCombo(combo.uuid, product, combo)">修改</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import { editCombo, delCombo, addComboMore} from '../vuex/actions.js'
    export default {
        props: ['product'],
        vuex: {
            actions: {
                editCombo, delCombo, addComboMore
            }
        },
    }
</script>