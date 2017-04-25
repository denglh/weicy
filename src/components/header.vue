<template>
    <header class="page-header clearfix">
        <span class="back" v-tap="back">
            <i class="icon icon-keyboard_arrow_left"></i>
        </span>
        <span class="menu" v-tap="toggleMenu($event)">
            <i class="icon icon-more_horiz"></i>
        </span>
        <h1>{{title}}</h1>
        <div class="clearfix"></div>
        <div class="link clearfix" v-show="showMenu" transition="slide">
            <a v-link="'/canteen/'" :class="{'active': seleded===0}">我要点菜</a>
            <a v-link="'/merchant/'" :class="{'active': seleded===1}">查看商家</a>
            <a v-link="'/user/'" :class="{'active': seleded===2}">个人中心</a>
        </div>
    </header>
</template>

<script>
    import { getshowMenu } from '../vuex/getters.js'
    import { setShowMenu } from '../vuex/actions.js'
    export default {
        props: [ 'seleded', 'title' ],
        vuex: {
            getters: {
                showMenu: getshowMenu
            },
            actions: {
                setShowMenu
            }
        },
        methods: {
            back(){
                window.history.go(-1)
            },
            toggleMenu(event){
                if(this.showMenu) {
                    this.setShowMenu(false)
                    $(event.target).addClass('rotate-out').one("webkitAnimationEnd animationend",function(){
                        $(this).removeClass('rotate-out').removeClass('rotate-in')
                    });
                    console.log($(event.target));
                }else{
                    this.setShowMenu(true)
                    $(event.target).addClass('rotate-in').one("webkitAnimationEnd animationend",function(){

                    });
                }
            }
        },
        ready(){
            this.setShowMenu(false)
        }
    }
</script>

<style scoped>
    .slide-transition {
        display: block;
    }
    .slide-enter {
        animation: slide-in .25s;
    }
    .slide-leave {
        animation: slide-out .25s;
    }
    @keyframes slide-in {
        0% { transform: translateY(-100%);}
        100% { transform: translateY(0);}
    }
    @keyframes slide-out {
        0% {transform: translateY(0);}
        100% {transform: translateY(-100%);}
    }
    .rotate-in {
        animation: rotatein 0.2s linear forwards;
    }
    @keyframes rotatein{
        0%{
            transform : rotate(0deg);
        }
        100%{
            transform : rotate(90deg);
        }
    }
    .rotate-out {
        animation: rotateout 0.2s linear forwards;
    }
    @keyframes rotateout{
        0%{
            transform : rotate(90deg);
        }
        100%{
            transform : rotate(0deg);
        }
    }
</style>