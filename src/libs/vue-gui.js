import Vue from 'vue'

/* 自定义过滤器 */
/**
 * [格式化时间戳]
 * @param  {String}     time   [传入的时间戳]
 * @param  {String}     str    [格式]
 * @return {String}            [返回格式化后的时间]
 * "yyyy-MM-dd hh:mm:ss.S"     ==> 2006-07-02 08:09:04.423
 * "yyyy-MM-dd E HH:mm:ss"     ==> 2009-03-10 二 20:09:04
 * "yyyy-MM-dd EE hh:mm:ss"    ==> 2009-03-10 周二 08:09:04
 * "yyyy-MM-dd EEE hh:mm:ss"   ==> 2009-03-10 星期二 08:09:04
 * "yyyy-M-d h:m:s.S"          ==> 2006-7-2 8:9:4.18
 */
Vue.filter( 'formatdate' , function(time, str){
    const dateTime = new Date(time)
    const week = {"0": "\u65e5","1": "\u4e00","2": "\u4e8c","3": "\u4e09","4": "\u56db","5": "\u4e94","6": "\u516d"};
    let o = {
        "M+": dateTime.getMonth() + 1,//月份
        "d+": dateTime.getDate(),//日
        "h+": dateTime.getHours() % 12 == 0 ? 12 : dateTime.getHours() % 12,//小时
        "H+": dateTime.getHours(),//小时
        "m+": dateTime.getMinutes(),//分
        "s+": dateTime.getSeconds(), //秒
        "q+": Math.floor((dateTime.getMonth() + 3) / 3),//季度
        "S": dateTime.getMilliseconds() //毫秒
    };
    if(/(y+)/.test(str)) {
        str = str.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
    };
    if(/(E+)/.test(str)) {
        str = str.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[dateTime.getDay() + ""]);
    };
    for(let k in o) {
        if(new RegExp("(" + k + ")").test(str)) {
            str = str.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        };
    };
    return str;
})

/**
 * [计算时间差]
 * @param  {[String]} time  [传入的时间戳]
 * @return {[String]}       [返回格式化后的时间]
 */
Vue.filter( 'timediff' , function(time) {
    const t = parseFloat(new Date - new Date(time)) / 1000;
    let str;
        if (t) {
            if (t > 60 && t < 3600) {
                str = parseInt(t / 60.0, 10) + '分钟前'
            } else if (t >= 3600 && t < 86400) {
                str = parseInt(t / 3600.0, 10) + '小时前'
            } else if (t >= 86400 && t < 86400 * 30) {
                str = parseInt(t / 86400.0, 10) + '天前'
            } else if (t >= 86400 * 30 && t < 86400 * 365) {
                str = parseInt(t / (86400.0 * 30), 10) + '个月前'
            } else if (t >= 86400 * 365) {
                str = parseInt(t / (86400.0 * 365), 10) + '年前'
            } else {
                str = parseInt(t, 10) + '秒前'
            }
        }
    return str;
})

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
                    if(isFadeIn){
                        this.el.style.opacity = 0
                        this.el.style.transition = 'opacity .3s'
                        this.el.style.webkitTransition = 'opacity .3s'
                    }
                    console.log("dd",value);
                    var compute = function(){
                        console.log(this.el);
                        if (this.el === null) {
                            return;
                        }
                        var rect = this.el.getBoundingClientRect();
                        var vpWidth = document.head.parentNode.clientWidth
                        var vpHeight = document.head.parentNode.clientHeight

                        var loadImg = function(){
                            this.el.src = value
                            console.log("value",value);
                            this.el.addEventListener('load',onloadEnd)
                            window.removeEventListener('scrollEnd',compute,true)
                            window.removeEventListener('resize',compute,true)
                            window.removeEventListener('scroll',computeBySpeed,true)
                            lastSpeeds = []
                        }.bind(this)
                        console.log(this.el.src == value);
                        if(this.el.src == value)return
                        if(isNoHori){
                            if(rect.bottom >=0 && rect.top <= vpHeight){
                                loadImg()
                            }
                        }else if(rect.bottom >=0 && rect.top <= vpHeight
                                && rect.right >= 0 && rect.left <= vpWidth){
                            loadImg()
                        }
                    }.bind(this)
                    var computeBySpeed = function(){
                        if(options.speed && aveSpeed > options.speed)return
                        compute()
                    }.bind(this)
                    var onload = function(){
                        console.log("加载图片");
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
                        if(isFadeIn)
                            this.el.style.opacity = 1
                        this.el.removeEventListener('load',onloadEnd)
                    }.bind(this)
                    this.el.addEventListener('load',onload)
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

;(function() {
    var vueTap = {};
    vueTap.install = function(Vue) {
        Vue.directive('tap', {
            isFn : true,
            acceptStatement : true,
            bind : function() {
                 //bind callback
            },
            update : function(fn) {
                var self = this;
                    self.tapObj = {};

                if(typeof fn !== 'function') {
                    return console.error('The param of directive "v-tap" must be a function!');
                }
                self.handler = function(e) { //This directive.handler
                    e.tapObj = self.tapObj;
                    fn.call(self,e);
                };
                if(self.isPC()) {
                    self.el.addEventListener('click',function(e) {
                        e.preventDefault();
                        fn.call(self,e);
                    },false);
                } else {
                    this.el.addEventListener('touchstart',function(e) {

                        if(self.modifiers.stop)
                            e.stopPropagation();
                        if(self.modifiers.prevent)
                            e.preventDefault();
                        self.touchstart(e,self);
                    },false);
                    this.el.addEventListener('touchend',function(e) {
                        //e.preventDefault();
                        self.touchend(e,self,fn);
                    },false);
                }
            },
            unbind : function() {},
            isTap : function() {
                var self   = this;
                if(self.el.disabled){
                  return false;
                }
                var tapObj = this.tapObj;
                return this.time < 150 && Math.abs(tapObj.distanceX) < 2 && Math.abs(tapObj.distanceY) < 2;
            },
            isPC : function() {
                var uaInfo = navigator.userAgent;
                var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
                var flag = true;
                for (var i = 0; i < agents.length; i++) {
                    if (uaInfo.indexOf(agents[i]) > 0) { flag = false; break; }
                }
                return flag;
            },
            touchstart : function(e,self) {
                var touches = e.touches[0];
                var tapObj = self.tapObj;
                tapObj.pageX = touches.pageX;
                tapObj.pageY = touches.pageY;
                tapObj.clientX = touches.clientX;
                tapObj.clientY = touches.clientY;
                self.time = +new Date();
            },
            touchend : function(e,self) {
                var touches = e.changedTouches[0];
                var tapObj = self.tapObj;
                self.time = +new Date() - self.time;
                tapObj.distanceX = tapObj.pageX - touches.pageX;
                tapObj.distanceY = tapObj.pageY - touches.pageY;


                if (!self.isTap(tapObj)) return;
                //setTimeout(function() {
                    self.handler(e);
                //},200)
            }
        });
    };

    if (typeof exports == "object") {
        module.exports = vueTap;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return vueTap })
    } else if (window.Vue) {
        window.vueTap = vueTap;
        Vue.use(vueTap);
    }
})();