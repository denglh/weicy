/**
* [parabola 抛物线运动效果]
* param  {Object} options [参数]
* @return
*/
define(function (require, exports, module){
    'use strict';
    exports.parabola = function(options){
    	/**
	    * [defaults 默认值]
	    */
	    var defaults = {
	        obj:        null,                           //param {String Or Object}    obj        [JQ对像或节点]
	        offset:     [],                          //param {[Object]}            offset     [要移动到的位置，也可以直接传一个节点自动获取]
	        curvature:  0.001,                          //param {Number}              curvature  [抛物线曲率，就是弯曲的程度，越接近于0越像直线]
	        movefn: function(){},
	        callback:   function() {}                   //param {Function}            callback   [进场动画]
	    };
	    var settings = $.extend({}, defaults, options || {}),
	        bola = $(settings.obj);
	        if(!bola.length) return;

	        console.log(bola);
	    var inter = null,
	        duration = settings.duration || 500,
	        sLeft = parseInt(bola.offset().left),
	        sTop = parseInt(bola.offset().top),
	        eLeft = 0,
	        eTop = 0;
	        console.log(typeof(settings.offset));
	        if(settings.offset.length > 1) {
	            eLeft = settings.offset[0];
	            eTop  = settings.offset[1];
	        }else{
	            var tragetObj = $(settings.offset);
	            eLeft = parseInt(tragetObj.offset().left) - sLeft;
	            eTop  = parseInt(tragetObj.offset().top) - sTop;
	        };
	    console.log(sLeft,sTop,eLeft,eTop);
	    function move(){
	        var x, y,
	            n = 1*new Date(),
	            b = (eTop - settings.curvature * eLeft * eLeft) / eLeft;
	        if (n > end) {
	            // 运行结束
	            x = eLeft;
	            y = eTop;
	            bola.css({
	                position: "fixed",
	                left: sLeft + x + "px",
	                top:  sTop + y + "px"
	            });
	            clearInterval(inter);
	            if ($.isFunction(settings.callback)) {
	                settings.callback(bola);
	            };
	        } else {
	            //x 每一步的X轴的位置
	            x = eLeft * ((n - begin) / duration);
	            //每一步的Y轴的位置y = a*x*x + b*x + c;   c==0;
	            y = settings.curvature * x * x + b * x;
	            bola.css({
	                position: "fixed",
	                left: sLeft + x + "px",
	                top:  sTop + y + "px"
	            });
	            if ($.isFunction(settings.movefn)) {
	                settings.movefn(bola);
	            };

	        }
	    };
	    //设置起止时间
	    var begin = 1*new Date();
	    var end = begin + duration;
	    if (eLeft === 0 && eTop === 0) return;
	    if (!!inter) clearInterval(inter);
	    inter = setInterval(function () {
	        var t = 1*new Date();
	        move(t);
	    }, 13);
    }
});