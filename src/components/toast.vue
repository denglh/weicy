<template>
    <div class="toast" v-if="toast.show">
        <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div>
        {{toast.text}}
    </div>
</template>

<script>
    export default {
        props: ['toast'],
        methods: {

        }
    }
</script>


<style lang="less" scoped>
.toast {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 900;
    padding: 2rem 3rem;
    margin-left: -6rem;
    margin-top: -10rem;
    border-radius: .3rem;
    background: rgba(0,0,0,.5);
    color: #fff;
    text-align: center;
    font-size: 1.4rem;
}

.spinner {
  margin: 0 auto 1rem;
  width: 5rem;
  height: 3.5rem;
  text-align: center;
  font-size: 1rem;
}

.spinner > div {
  background-color: #fff;
  height: 100%;
  width: .3rem;
  display: inline-block;
  margin: 0 .2rem;
  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.5) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.5);
    -webkit-transform: scaleY(0.5);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>
