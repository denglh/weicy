
<template>
    <div class="page-list">
        <page-header :title="'点餐'"></page-header>

        <section class="wrap">
            <div class="notice" v-if="notice.length" v-tap="showNotice">
                <span class="vm" v-text="notice"></span>
                <i class="icon icon-error_outline"></i>
            </div>
            <shoplist :products="products" ></shoplist>
        </section>

        <footer class="footer">
            <component :is="currentView"></component>
        </footer>

        <modal :modal="modal"></modal>

        <mask></mask>

        <toast :toast="toast"></toast>
    </div>
</template>

<script>
    import PageHeader from '../components/header.vue'
    import Shoplist from '../components/shoplist.vue'
    import Cart from '../components/cart.vue'
    import Combo from '../components/combo.vue'
    import Attr from '../components/attr.vue'
    import Modal from '../components/modal.vue'
    import Mask from '../components/mask.vue'
    import Toast from '../components/toast.vue'

    import { getCurrentVue, getProducts, getGenres, getCart, getModal, getToast } from '../vuex/getters.js'
    import { setProducts, setModal, setToast } from '../vuex/actions.js'

    import { parabola } from '../libs/parabola.js'

    export default {
        data(){
            return {
                notice: '',
            }
        },
        components: {
            PageHeader, Attr, Combo, Cart, Shoplist, Modal, Mask, Toast,
        },
        methods: {
            //计算大小
            computeSize(){
                const pageWidth = document.documentElement.clientWidth
                const pageHeight = document.documentElement.clientHeight
                const height = pageHeight - document.querySelector(".page-header").offsetHeight - 50
                const noticeHeight = this.notice.length ? 41 : 0
                console.log('noticeHeight',noticeHeight);
                document.querySelector(".wrap").style.height = height + 'px'
                document.querySelector(".shopping").style.height = height - noticeHeight + 'px'
            },
        },
        vuex: {
            getters: {
                currentView: getCurrentVue,
                genres: getGenres,
                products: getProducts,
                cart: getCart,
                modal: getModal,
                toast: getToast,
            },
            actions: {
                setProducts,
                setModal,
                setToast,
            }
        },
        route: {
            data() {
                let self = this
                self.setToast({show: true, text: '加载中'})
                self.setProducts((response) => {
                    self.notice = response.notice
                    self.computeSize()
                })
            },
        },
        ready(){
            $(document).on('click', '.shopping .add', function(){
                const _this = $(this)
                if(_this.parent().hasClass('type-attr') || _this.parent().hasClass('type-combo')) return;
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
        },

    }
</script>


