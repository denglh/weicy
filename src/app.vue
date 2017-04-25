<template>
    <div class="main" id="app">
        <router-view ></router-view>
    </div>
</template>

<script>
    require('../static/css/style.less')
    require('../static/css/animate.css')
    import store from './vuex/store'
    export default {
        store,
    };
</script>