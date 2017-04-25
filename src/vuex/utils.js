import Vue from 'vue'
import store from './store'
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

Vue.filter('array2string', function(array) {
    return array.length === 1 ? array[0] : array.join(' ')
});

Vue.filter('value2name', function(v,list) {
    let rs = v.map((one, index) => {
        return list.find((item) => {
            return item.value === one
        })
    })
    return rs.map((one) => {
        return one.name
    }).join(' ').replace('--', '')
});


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

Vue.filter( 'transTab' , function(tab) {
    let str;
        switch (tab) {
        case 'good':
          str = '精华';
          break;
        case 'share':
          str = '分享';
          break;
        case 'job':
          str = '招聘';
          break;
        case 'ask':
          str = '问答';
          break;
        default:
    }
    return str;
})

/* 一些数据处理 */
const LOCALSTORAGE_KEY_PRODUCTS = 'WCY_PRODUCTS'
const LOCALSTORAGE_KEY_CART     = 'WCY_CART'
const LOCALSTORAGE_KEY_ATTRS    = 'WCY_ATTRS'

/*本地数据操作类*/
try {
    if(window.localStorage){
        var LS = {};
        LS.get = function (name) {
            return window.localStorage.getItem(name);
        }
        LS.set = function (name, value) {
            return window.localStorage.setItem(name, value);
        }
        LS.del = function (name) {
            return window.localStorage.removeItem(name);
        }
        LS.clear = function() {
            return window.localStorage.clear();
        }
    }
} catch(e) {
    console.log("浏览器不支持localStorage！");
}
export const localStorage = LS

export const isTouch = function(){ return 'ontouchstart' in window }

//更新分类数量
export const updataGenresCount = function(genres, cart){
    genres.forEach(function(genre){
        var count = 0
        cart.forEach(function(product){
            if(product.cid === genre.cid) count+=product.quantity
        })
        genre.quantity = count
        if(store.state.debug) console.log("ACTION:", "更新分类数量{ cid: " + genre.cid + ",quantity :", genre.quantity+"}");
    })
}

//保存购物车到本地
export const setCartLocalData = function(cart){
    var temp = ''
    for (let i = 0; i < cart.length; i++) {
        if(i!==0) temp+='|'
        temp += JSON.stringify(cart[i])
    }
    if(store.state.debug) console.log(temp);
    localStorage.set(LOCALSTORAGE_KEY_CART, temp)
}

//返回本地购物车列表
export const getCartLocalData = function(){
    const cart = localStorage.get(LOCALSTORAGE_KEY_CART)
    const added = [];
    if(cart !== null && cart !== '') {
        var cartArr = cart.split('|')
        for (let i = 0; i < cartArr.length; i++) {
            added.push(JSON.parse(cartArr[i]))
        }
    }
    return added
}

/**
 * 根据KEY重新分组
 * @param  {string} keyName [key名称]
 * @param  {object} arr     [要处理的数组]
 * @return {object}         [返回一个分类对像]
 */
export const reGrouping = function(keyName, arr){
    var b = {};
    $.each(arr, function (i,v){
        var g = v[keyName],
            c = b[g];
        if(c){
            b[g].push(v);
        }else{
            b[g] = [v];
        };
    });
    return b;
}
/**
 * [getIndexToArray description]
 * @param  {[type]} value [description]
 * @param  {[type]} arr   [description]
 * @return {[type]}       [description]
 */
export const getIndexToArray = function(value, arr){
    let curIndex = undefined
    arr.forEach(function(item, index){
        for(let key in item) {
            if(item[key] === value) {
                console.log("0000000000000",item[key])
                curIndex = index;
            }
        }
    })
    return curIndex
}



if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        if (i in list) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
      }
      return undefined;
    }
  });
}