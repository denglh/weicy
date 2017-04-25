
<template>
    <div class="page-list">
        <page-header :title="'点餐'"></page-header>

        <section class="wrap">
            <div v-if="$route.query.display === 'img'">
                <div class="s-notice clearfix" v-tap="showNotice">
                    <div class="left m-logo">
                        <img src="../../static/images/m-logo.png" alt="">
                    </div>
                    <div class="right">
                        <div class="title">点餐公告</div>
                        <div class="text" v-html="notice"></div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="notice" v-if="notice.length" v-tap="showNotice">
                    <span class="vm" v-html="notice"></span>
                    <i class="icon icon-error_outline"></i>
                </div>
                <genre :genres="genres"></genre>
            </div>

            <shoplist :products="products"></shoplist>
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
    import Genre from '../components/genre.vue'
    import Modal from '../components/modal.vue'
    import Mask from '../components/mask.vue'
    import Toast from '../components/toast.vue'

    import { getCurrentVue, getProducts, getGenres, getCart, getModal, getToast } from '../vuex/getters.js'
    import { setCanteen, setModal, setToast } from '../vuex/actions.js'

    import { parabola } from '../libs/parabola.js'

    export default {
        data(){
            return {
                notice: '',
            }
        },
        components: {
            PageHeader,Attr, Combo, Cart, Shoplist, Genre, Modal, Mask, Toast,
        },
        methods: {
            //计算大小
            computeSize(){
                const pageWidth = document.documentElement.clientWidth
                const pageHeight = document.documentElement.clientHeight
                const height = pageHeight - document.querySelector(".page-header").offsetHeight - 40
                let noticeHeight =  0
                if(this.$route.query.display === 'list'){
                    if(this.notice.length) {
                        noticeHeight = 41
                    }else{
                        noticeHeight = 0
                    }
                }else{
                    noticeHeight = 0
                }
                document.querySelector(".wrap").style.height = height + 'px'


                if(this.$route.query.display === 'list') {
                    const genresWidth = document.querySelector(".genres").offsetWidth
                    document.querySelector(".shopping").style.width = pageWidth - genresWidth - 1 + 'px'
                    document.querySelector(".shopping").style.height = height - noticeHeight + 'px'
                    document.querySelector(".genres").style.height = height - noticeHeight + 'px'
                    document.querySelector(".genres").style.width = (genresWidth + 1) + 'px'
                }
            },
            showNotice(){
                const self = this
                self.setModal({
                    show: true,
                    title: '公告',
                    content: self.notice,
                    cancelText: '',
                    confirmText: '确定',
                    cancel: ()=>{self.setModal({ show: false})},
                    confirm:()=>{self.setModal({ show: false})},
                })
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
                setCanteen,
                setModal,
                setToast,
            }
        },
        route: {
            data() {
                let self = this
                self.setToast({show: true, text: '加载中'})

                console.log(this.$route.query.display)

                self.setCanteen((response) => {
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


