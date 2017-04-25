<template>
    <div class="modal-mask" v-show="modal.show" transition="modal">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header" v-text="modal.title"></div>
                <div class="modal-body" v-text="modal.content"></div>
                <div class="modal-footer">
                    <button v-show="modal.cancelText" class="modal-default-button btn-cancel" :class="{'text-ls': modal.cancelText.length < 3}" v-tap="modal.cancel(this)" v-text="modal.cancelText"></button>
                    <button class="modal-default-button btn-confirm" :class="{'full': !modal.cancelText,'text-ls': modal.confirmText.length < 3}" v-tap="modal.confirm(this)" v-text="modal.confirmText"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['modal']
}
</script>

<style lang="less" scoped>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }
    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }
    .modal-container {
        width: 300px;
        margin: 0px auto;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
        transition: all .3s ease;
    }
    .modal-header {
        padding: 20px 20px;
        font-size: 1.6rem;
    }
    .modal-body {
        padding: 0px 20px 25px;
        font-size: 1.4rem;
        line-height: 2rem;
    }
    .modal-footer {
        height: 50px;
        border-top: 1px solid #DDDDDD;
    }
    .modal-footer button {
        width: 50%;
    }
    .modal-default-button {
        float: left;
        height: 50px;
        background: transparent;
        border:none;
        color: #999;
        font-size: 1.4rem;
        &.text-ls {
            word-spacing: 1rem;
            letter-spacing: 1rem;
        }
    }
    .modal-footer .btn-confirm {
        color: #3EB07D;
        border-left: 1px solid #DDDDDD;
    }
    .modal-footer .btn-confirm.full { width: 100%;}
    .modal-enter, .modal-leave {
        opacity: 0;
    }
    .modal-enter .modal-container,
    .modal-leave .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
</style>
