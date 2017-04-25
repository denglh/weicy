<template>
    <div class="page-detail">

        <page-header :title="product.title"></page-header>

        <div class="img">
            <img :src="pic" v-lazyload="product.img" alt="{{ product.title }}">
        </div>

        <div class="detail">
            <div class="title f14" v-text="product.title"></div>
            <div class="meta clearfix">
                <div class="left m-price">
                    <span class="price number orange f14" v-text="product.price | currency '￥'"></span>
                    <span class="sprice number del" v-text="product.sprice | currency '￥'"></span>
                </div>

                <div class="right counter">
                    <counter :product="product"></counter>
                </div>
            </div>
        </div>

        <div class="comment">
            <div class="title">商品评论</div>
            <div class="comment-list"><p>还没有人发表评论！</p></div>
        </div>

        <footer class="footer">
            <component :is="currentView" transition="fade" transition-mode="out-in"></component>
        </footer>


        <mask></mask>

        <toast :toast="toast"></toast>

    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Cart from '../components/cart.vue'
    import Attr from '../components/attr.vue'
    import Counter from '../components/counter.vue'
    import Modal from '../components/modal.vue'
    import Mask from '../components/mask.vue'
    import Toast from '../components/toast.vue'

    import { setProduct, setToast } from '../vuex/actions.js'
    import { getCurrentVue, getDetailProduct, getToast } from '../vuex/getters.js'

    import { parabola } from '../libs/parabola.js'
    export default {
        data(){
            return {
                showloading: true,
                pic: 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==',
            }
        },
        components: { PageHeader, Attr, Cart, Counter, Modal, Mask, Toast },
        vuex: {
            getters: {
                product: getDetailProduct,
                currentView: getCurrentVue,
                toast: getToast,
            },
            actions: {
                setProduct, setToast
            }
        },
        route: {
            data () {
                this.setToast({show: true, text: '加载中'})
                this.setProduct(this, Number(this.$route.query.id))
                console.log(this.$route.query.id);
            }
        },
        ready(){
            $(document).on('click', '.detail .add', function(){
                const _this = $(this)
                if($(this).parent().hasClass('type-attr')) return;
                $(this).parent().append('<i class="icon icon-exposure_plus_1"></i>')
                const end = $('.cart .ret i')
                parabola({
                    obj:        $(this).next(),
                    offset:     end,
                    curvature:  0.009,
                    callback:   function(obj) {
                        obj.remove()
                        end.addClass('element-animation').one("webkitAnimationEnd animationend",function(){
                            $(this).removeClass('element-animation')
                        });
                        end.parent().addClass('shine')//放大，发光
                    }
                })
            })
        }
    }
</script>

<style>
    .img2 {position: relative; display: block; width: 100%; height: 380px; margin: 1rem 0;}
    .img2 img { width:100%; display: block;}
</style>
