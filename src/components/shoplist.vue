<template>
    <div class="shopping" :class="$route.query.display === 'img' ? 'shopping-img' : 'shopping-list'">
        <ul class="product-list">
            <li class="clearfix" v-for="p in products" :class="{'sellout': !p.inventory}" data-cid="{{p.cid}}">
                <div v-if="$route.query.display === 'list'">
                    <div class="left img">
                        <img v-bind:src="p.img" alt="{{ p.title }}">
                    </div>
                    <div class="left detail">
                        <div class="title">[{{p.cid}} - {{p.fid}} - {{p.type}}]
                            <a v-link="{ name: 'detail', query: { id: p.fid }}" v-text="p.title"></a>
                        </div>
                        <div class="sold">已售: <span class="number f14">20</span></div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="meta clearfix">
                        <div class="left m-price">
                            <div v-if="p.type == '4'">
                                <span class="text" v-text="'价格按选择菜品合计'"></span>
                            </div>
                            <div v-else>
                                <span class="price" v-text="p.price | currency '￥'"></span>
                                <span class="sprice" v-text="p.sprice | currency '￥'"></span>
                            </div>
                        </div>
                        <div class="right counter">
                            <counter :product="p"></counter>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="img">
                        <img v-bind:src="p.img" alt="{{ p.title }}">
                    </div>
                    <div class="detail">
                        <div class="title">[{{p.cid}} - {{p.fid}} - {{p.type}}]
                            <a v-link="{ name: 'detail', query: { id: p.fid }}" v-text="p.title"></a>
                        </div>
                        <div class="meta clearfix">
                            <div class="left m-price">
                                <div v-if="p.type == '4'">
                                    <span class="text" v-text="'价格按选择菜品合计'"></span>
                                </div>
                                <div v-else>
                                    <span class="price" v-text="p.price | currency '￥'"></span>
                                    <span class="sprice" v-text="p.sprice | currency '￥'"></span>
                                </div>
                            </div>
                            <div class="left">
                                <div class="sold">已售: <span class="number f14">20</span></div>
                            </div>
                            <div class="right counter">
                                <counter :product="p"></counter>
                            </div>
                        </div>
                    </div>
                </div>
                <combolist :product="p"></combolist>
            </li>
        </ul>
    </div>
</template>

<script>
    import Counter from './counter.vue'
    import Combolist from './combolist.vue'
    export default {
        props: ['products'],
        components: { Counter, Combolist },
    }
</script>
