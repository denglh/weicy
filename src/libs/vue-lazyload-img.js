/**
 * Vue lazyload img plugin
 * especially optimized for mobile browsers
 * support umd(https://github.com/umdjs/umd)
 * capable of require.js, sea.js, CommonJS
 * @author: JALBAA
 * @email: 116682877@qq.com
 */
;(function() {
    var vueLazyimg = {};
    vueLazyimg.install = function(Vue,options){

            options = options || {
                fadein: false,
                speed: 20,
                nohori: false
            }
            //custom scrollEnd event
            if(options.speed){
                var cntr = 0
                var lastCntr = 0
                var diff = 0
                var scrollEnd = document.createEvent('HTMLEvents');
                scrollEnd.initEvent('scrollEnd',true,false)
                scrollEnd.eventType = 'message'
                function enterFrame(){
                    if(cntr != lastCntr){
                        diff++
                        if(diff == 5){
                            window.dispatchEvent(scrollEnd)
                            cntr = lastCntr
                        }
                    }
                    requestAnimationFrame(enterFrame);
                }
                window.requestAnimationFrame(enterFrame)
                document.addEventListener('scroll',function(){
                    lastCntr = cntr
                    diff = 0
                    cntr++
                },true)
            }
            //compute scroll speed
            var lastPosY = document.body ? document.body.getBoundingClientRect().top : document.head.parentNode.getBoundingClientRect().top
            var lastPosX = document.body ? document.body.getBoundingClientRect().left : document.head.parentNode.getBoundingClientRect().left
            var lastSpeeds = []
            var aveSpeed = 0
            function getSpeed(el){
                var curPosY = el ? el.getBoundingClientRect().top : 0
                var curPosX = el ? el.getBoundingClientRect().left: 0
                var speedY = lastPosY - curPosY
                var speedX = lastPosX - curPosX
                if(lastSpeeds.length<10){
                    lastSpeeds.push((speedY+speedX)/2)
                }else{
                    lastSpeeds.shift()
                    lastSpeeds.push((speedY+speedX)/2)
                }
                var sumSpeed = 0
                lastSpeeds.forEach(function(speed){
                    sumSpeed += speed
                })
                aveSpeed = Math.abs(sumSpeed/lastSpeeds.length)
                lastPosY = curPosY
                lastPosX = curPosX
            }
            document.addEventListener('scroll',function(e){
                if(!options.speed) return
                var el = null
                for(var i=0; i<e.target.childNodes.length; i++){
                    if(e.target.childNodes[i].nodeType == 1){
                        el = e.target.childNodes[i]
                        break;
                    }
                }
                getSpeed(el)
            },true)
            Vue.directive('lazyload', {
                isFn : true,
                acceptStatement : true,
                bind : function() {
                     //bind callback
                },
                update: function(value) {
                    var isFadeIn = this.modifiers.fadein || options.fadein
                    var isNoHori = this.modifiers.nohori || options.nohori

                    var img = new Image()
                        img.src = value

                    if(isFadeIn){
                        this.el.style.opacity = 0
                        this.el.style.transition = 'opacity .3s'
                        this.el.style.webkitTransition = 'opacity .3s'
                    }
                    console.log("dd",value);
                    var compute = function(){
                        if (this.el === null) {
                            return;
                        }
                        var rect = this.el.getBoundingClientRect();
                        var vpWidth = document.head.parentNode.clientWidth
                        var vpHeight = document.head.parentNode.clientHeight
                        var loadImg = function(){
                            this.el.src = value
                            console.log("value",value);
                            var parent = this.el.parentNode;
                            var node = document.createElement("SPAN");
                            node.className = 'img-load';
                            if(parent.querySelector('span') === null)
                                parent.appendChild(node);
                            this.el.addEventListener('load',onloadEnd)
                            window.removeEventListener('scrollEnd',compute,true)
                            window.removeEventListener('resize',compute,true)
                            window.removeEventListener('scroll',computeBySpeed,true)
                            lastSpeeds = []
                        }.bind(this)
                        console.log("加载图片：",this.el.src == value);
                        if(this.el.src == value)return
                        if(isNoHori){
                            if(rect.bottom >=0 && rect.top <= vpHeight){
                                loadImg()
                            }
                        }else if(rect.bottom >=0 && rect.top <= vpHeight && rect.right >= 0 && rect.left <= vpWidth){
                            loadImg()
                        }
                    }.bind(this)
                    var computeBySpeed = function(){
                        if(options.speed && aveSpeed > options.speed)return
                        compute()
                    }.bind(this)
                    var onload = function(){
                        compute();
                        this.el && this.el.removeEventListener('load',onload)
                        window.addEventListener('scrollEnd',compute,true)
                        window.addEventListener('resize',compute,true)
                        window.addEventListener('scroll',computeBySpeed,true)
                    }.bind(this)
                    var onloadEnd = function(){
                        if (this.el === null) {
                            return;
                        }
                        if(isFadeIn){
                            this.el.style.opacity = 1
                        }
                        this.el.removeEventListener('load',onloadEnd)
                        var parent = this.el.parentNode;
                        parent.removeChild(parent.querySelector('span'))
                    }.bind(this)
                    img.addEventListener('load',onload)
                }
            })
    }
    if (typeof exports == "object") {
        module.exports = vueLazyimg;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return vueLazyimg })
    } else if (window.Vue) {
        window.vueLazyimg = vueLazyimg;
        Vue.use(vueLazyimg);
    }
})();