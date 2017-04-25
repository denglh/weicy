<template>
    <aside class="genres">
        <ul>
            <li class="clearfix animated" :class="{'active': seleded===$index}" v-for="p in genres"  v-tap="scrollProduct(p.cid, $index, $event)" transition="fadein" fadein="100">
                <span v-text="p.title"></span>
                <em v-if="!!p.quantity" v-text="p.quantity"></em>
            </li>
        </ul>
    </aside>
</template>

<script>
    export default {
        data(){
            return {
                seleded: 0
            }
        },
        props: ['genres'],
        methods: {
            scrollProduct(cid, index){
                this.seleded = index
                const pageHeight = document.documentElement.clientHeight
                const item = $('.product-list li[data-cid='+cid+']')
                $('.shopping').stop().animate({
                    scrollTop: item.get(0).offsetTop - 15 + "px"
                }, 200);
            }
        },
        transitions: {
            fadein: {
                type: 'animation',
                enterClass: 'fadeIn',
                leaveClass: 'fadeOut'
            }
        }
    }
</script>

