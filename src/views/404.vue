<template>
    <div class="not-found">
        <img src="../../static/images/404.png" height="120" width="136" alt="404">
        <p>哎呀...<br>您访问的页面不见了</p>
        <p>{{ time }}秒后将自动跳转到首页</p>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                time: 5,
            }
        },
        route: {
            data() {
                const t = setInterval(() => {
                    if (this.time <= 0) {
                        clearInterval(t);
                        this.$route.router.go({ name: 'index' });
                        return;
                    }
                    this.time -= 1;
                }, 1000);
            },
        },
    }
</script>

<style lang="less">
    .not-found {
        text-align: center;
        margin-top: 15rem;
        img { margin-bottom: 2rem; }
        p {
            font-size: 2rem;
            line-height: 3rem;
            text-shadow: 0px 0px 3px rgba(0, 0, 0, .4);
        }
    }
</style>
