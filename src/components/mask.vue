<template>
    <div class="global-mask" v-if="mask" v-tap="setMask(false)" transition="modal"></div>
</template>

<script>
    import { setMask } from '../vuex/actions.js'
    import { getShowMask } from '../vuex/getters.js'
    export default {
        vuex: {
            getters: {
                mask: getShowMask
            },
            actions: {
                setMask,
            }
        },
        methods: {

        }
    }
</script>

<style lang="less" scoped>
    .global-mask {
        position: fixed;
        z-index: 600;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }
    .modal-enter, .modal-leave {
        opacity: 0;
    }
    .modal-enter .modal-container,
    .modal-leave .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
