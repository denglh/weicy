// action 会收到 store 作为它的第一个参数

// 测试数据
//import Mock from '../mock.js'
var Random = Mock.Random


export const __POST = function( url, data, successCallback, errorCallback) {
    $.ajax({
        method: "POST",
        url: url,
        data: data,
        dataType: 'json'
    }).done(function( data ) {successCallback(data)
    }).fail(function(e) {errorCallback(e)})
}

export const setWeixin = ({ dispatch, state }, data) => {
    dispatch('RECEIVE_WEIXIN', data)
}


//获取商品
export const setCanteen = ({ dispatch, state }, cb) => {
    Mock.mock(/products.json/, {
        'state': 200,
        'notice': 'Vuejs实战SPA之微餐饮万圣节创意翻糖饼干万圣节创意翻糖饼干栗子苹梨鸡蛋布丁',
        'genres|3-6': [{
            'cid|+1': 10,
            'title|1': ['川菜','粤菜','湘菜','鲁菜','东北菜','北京菜','闽菜'],
            'quantity': 0,
        }],
        'list|2-5': [{
            'cid|+1': 10,
            'fid|+1': 1000,
            'title|1': ['麻油当归鲜虾面','万圣节创意翻糖饼干','栗子苹梨鸡蛋布丁','脆面虱目鱼柳','创意榨菜猪肚丝堡','姜汁烧肉风味薯泥(创意日式料理)','创意气炸锅香蕉胖蛋糕',
            '抓饼寿司卷(即食创意)','<九阳豆浆机>英式创意豆浆红茶','创意造型便当-微笑辫子女孩','创意茶谱-异国香橙茶','爱心造型汤圆【富发行创意料理】'],
            'inventory|0-100': 100,
            'quantity': 0,
            'price|5-30': 30,
            'sprice|10-50': 50,
            'sold|1-100':100,
            'hasattr|1-2': true,
            'combos': [],
            //'type|1': ['1','2','3','4'], //单菜，有规各，固定套餐, 组合套餐
            'type': "4",
            //'hasattr': true,
            'img': Random.image('345x180', '#50B347', '#FFF', 'Mock.js')
        }],
    })
    __POST('products.json', {},
        (response) => {
            dispatch('RECEIVE_PRODUCTS', response.list)
            dispatch('RECEIVE_GENRES', response.genres)
            dispatch('SET_TOAST', { show: false })
            if(cb && typeof cb === 'function') cb(response)
        },
        (err) => {
            console.log(err)
        }
    );
}


//获取商品属性
export const setAttrs = ({ dispatch, state }, self) => {
    Mock.mock(/attr.json/, {
        'name': 'attr',
        'attrs|2-5': [{
            'cid': 10,
            'aid|+1': 20,
            'fid': self.product.fid,
            'title|1': ['大份','中份','小份'],
            'inventory|0-100': 100,
            'quantity': 0,
            'price|5-30': 30,
            'hasattr': false
        }]
    })
    __POST( 'attr.json', {},
        (response) => {
            dispatch('RECEIVE_ATTRS', response.attrs)
        },
        (err) => {
            console.log(err)
        }
    )
}

//获取固定套餐
export const setCombo = ({ dispatch, state }, self) => {
    Mock.mock(/combo.json/, {
        'state': 200,
        'combo': {
            'cid': 10,
            'fid': self.product.fid,
            'price|5-30': 30,
            'rows|3': [{
                'title|1': ['必选菜品', '饮料', '小吃'],
                //'require|1': [0,1,2], //必选
                'require': 2, //必选
                'foods|3-5': [{
                    'fid|+1': 40,
                    'title|1': ['可乐', '雪碧', '鸡翅', '花生', '王老吉', '加多宝'],
                    'inventory|0-100': 100,
                    'price|5-30': 30,
                    'selected|1': [0,0],
                    'chagne': false
                }]
            }]
        },
    })
    __POST( 'combo.json', {},
        (response) => {
            dispatch('RECEIVE_COMBO', response.combo)
            if(response.combo.rows.length){
                dispatch('RECEIVE_COMBO_FOODS')
            }
        },
        (err) => {
            console.log(err)
        }
    )
}
//获取商品详情信息
export const setProduct =  ({ dispatch, state }, self, fid) => {
    Mock.mock(/product.json/, {
        'cid': 10,
        'fid': fid,
        'title|1': ['麻油当归鲜虾面','万圣节创意翻糖饼干','栗子苹梨鸡蛋布丁','脆面虱目鱼柳','创意榨菜猪肚丝堡','姜汁烧肉风味薯泥(创意日式料理)','创意气炸锅香蕉胖蛋糕',
            '抓饼寿司卷(即食创意)','<九阳豆浆机>英式创意豆浆红茶','创意造型便当-微笑辫子女孩','创意茶谱-异国香橙茶','爱心造型汤圆【富发行创意料理】'],
        'inventory|0-100': 100,
        'quantity': 0,
        'price|5-30': 30,
        'sprice|10-50': 50,
        'sold|1-100':100,
        'hasattr': false,
        'img': Random.image('640x500', '#50B347', '#FFF', 'Mock.js')
    })
    __POST( 'product.json', { fid: fid },
        (response) => {
            dispatch('RECEIVE_PRODUCT', response)
            dispatch('SET_TOAST', { show: false })
        },
        (err) => {
            console.log(err)
        }
    )
}

//获取商家信息
export const setMerchant = ({ dispatch, state }, cb) => {
    Mock.mock(/merchant.json/, {
        name: '广州第一人民医院',
        notice: ['11111','22222'],
        address: '广东省广州市番禺区珠江新城',
        mobile: '15014303750',
    })
    __POST( 'merchant.json', { },
        (response) => {
            if(cb && typeof cb === 'function') cb(response)
        },
        (err) => {
            console.log(err)
        }
    )
}

//获取预定信息
export const setReserve = ({ dispatch, state }, cb) => {
    Mock.mock(/merchant.json/, {
        name: '预定-广州第一人民医院',
    })
    __POST( 'merchant.json', { },
        (response) => {
            if(cb && typeof cb === 'function') cb(response)
        },
        (err) => {
            console.log(err)
        }
    )
}

//获取用户中心
export const setUserCenter = ({ dispatch, state }, cb) => {
    Mock.mock(/user.json/, {
        isUserRank: 1,
        userRankInfo: '普通会员',
        hasICcard: true,
    })
    __POST( 'user.json', { },
        (response) => {
            if(cb && typeof cb === 'function') cb(response)
        },
        (err) => {
            console.log(err)
        }
    )
}

//获取订单列表
export const setOrderList = ({ dispatch, state }, cb) => {
    Mock.mock(/order.json/, {
        "name": "order",
        "total": 25,
        "page": 1,
        "list|10-15": [{
            'oid|+1': 12000,
            'title': '广州第一人民医院',
            'time': Date.parse(new Date()) - 1582200,
            'state|1': ['未支付','已支付'],
            'price': '205.00',
        }]
    });
    __POST('order.json', {},
        (response) => {
            dispatch('SET_TOAST', {show: false })
            if(cb && typeof cb === 'function') cb(response)
        },
        (err) => {
            console.log(err)
        }
    );
}

//获取订单详情
export const setOrderDetail = ({ dispatch, state }, cb) => {
    Mock.mock(/orderDetail.json/, {
        "state": 200,
        "msg": "",
        "info": [
            {'name': '订单号','val': '101602',},
            {'name': '下单时间','val': '2016-07-08 19:59:52',},
            {'name': '实付金额','val': '0.00',},
            {'name': '支付方式','val': '线下支付',},
            {'name': '订单状态','val': '未支付',},
            {'name': '送达位置','val': '学城北',},
            {'name': '称呼','val': '许先生',},
            {'name': '手机','val': '13188888888',},
            {'name': '备注','val': '',}
        ],
        "foods": {
            'title': '2016-07-08 [午餐]',
            'list': [
                { name: '爆炸鸡(大份)', price: '2.00', quantity: 1},
                { name: '爆炸鸡(中份)', price: '2.00', quantity: 1},
                { name: '爆炸鸡(小份)', price: '2.00', quantity: 1},
            ]
        }
    });
    __POST('orderDetail.json', {},
        (response) => {
            if(response.state === 200) {
                if(cb && typeof cb === 'function') cb(response)
            }else{
                console.log(response.msg);
            }
        },
        (err) => {
            console.log(err)
        }
    );
}

//获取收货地址
export const setAddress = ({ dispatch, state }, self) => {
    Mock.mock(/orderAddress.json/, {
        "state": 200,
        "address": {
            type: 1, //[0,1,2]
            name: '邓柳辉',
            mobile: '15913101529',
            locationid: '10596,10597,10598',
            location: '护士站 一楼 101'
        },
    });
    __POST('orderAddress.json', {},
        (response) => {
            dispatch('RECEIVE_ADDRESS', response.address)
            dispatch('SET_TOAST', {show: false })
        },
        (err) => {
            console.log(err)
        }
    );
}

//获取详细的收货地址
export const setLocation = ({ dispatch, state }, self, cb) => {
    Mock.mock(/orderAddressLocation1.json/, {
        "state": 200,
        "list": [
            {id: "12414", title: "天津市市辖区", mode: "2"},
            {id: "12267", title: "护士站", mode: "1"},
            {id: "11456", title: "天下品汇测试食堂", mode: "1"},
            {id: "12415", title: "广东省广州市番禺区", mode: "2"},
        ],
    });
    Mock.mock(/orderAddressLocation2.json/, {
        "state": 200,
        "list|1-2": [
            {id: "10597", title: "一楼", mode: "1"},
            {id: "10598", title: "二楼", mode: "1"}
        ],
    });
    Mock.mock(/orderAddressLocation3.json/, {
        "state": 200,
        "list|1-4": [
            {id: "10598", title: "101室", mode: "1"},
            {id: "10598", title: "102室", mode: "1"},
        ],
    });

    let url = ''
    if(self.lid === "0") {
        url = 'orderAddressLocation1.json'
    }else if(self.lid === '12267'){
        url = 'orderAddressLocation2.json'
    }else if(self.lid === '12415'){
        url = 'orderAddressLocation3.json'
    }

    __POST(url, {id: self.lid},
        (response) => {
            if(cb && typeof cb === 'function') cb(response)
        },
        (err) => {
            console.log(err)
        }
    );
}

//获取订单提交基本信息
export const setPayway = ({ dispatch, state }, self) => {
    Mock.mock(/orderPayway.json/, {
        "state": 200,
        "payType": [
            {id: 1, name: '微信支付', reduction: false},
            {id: 2, name: 'IC卡支付', reduction: {title: '满50减10'}},
            {id: 3, name: '线下支付', reduction: false},
            {id: 4, name: '会员余额支付', reduction: {title: '充100送20'}}
        ],
    });
    __POST('orderPayway.json', {},
        (response) => {
            self.payType = response.payType
            dispatch('SET_TOAST', {show: false })
        },
        (err) => {
            console.log(err)
        }
    );
}

//获取订单提交菜品
export const setOrderConfirmFoods = ({ dispatch, state }, self) => {
    Mock.mock(/orderConfirmFoods.json/, {
        "state": 200,
        'foods': {
            'cid': 1000,
            'did': 0,
            'name': '今日晚市',
            'day': '2016/07/15',
            'list|2-5': [{
                'aid': 0,
                'cid': 1000,
                'fid|+1': 100002,
                'reduction|1-2': true,
                'is_discount': 1,
                'name|1': ['麻油当归鲜虾面','万圣节创意翻糖饼干','栗子苹梨鸡蛋布丁','脆面虱目鱼柳','创意榨菜猪肚丝堡','姜汁烧肉风味薯泥(创意日式料理)','创意气炸锅香蕉胖蛋糕','抓饼寿司卷(即食创意)','<九阳豆浆机>英式创意豆浆红茶','创意造型便当-微笑辫子女孩','创意茶谱-异国香橙茶','爱心造型汤圆【富发行创意料理】'],
                'quantity|1': ['1','2','3','5'],
                'price': '5.00'
            }]
        },
        'coupons': [{ id: 102, name: '满20减10块',price: '10.00',},{ id: 103, name: '满10减2块',price: '2.00',}],
        'reduction': [],
    });
    __POST('orderConfirmFoods.json', self.postData,
        (response) => {
            console.log(response);
            self.result = response
            self.ifUpdate = false
            self.total()
            dispatch('SET_TOAST', {show: false })
        },
        (err) => {
            console.log(err)
        }
    );
}

//购物车中增加数量
export const addQuantity = ({ dispatch, state }, product, parent, _cb) => {
    if (product.inventory > 0) {
        dispatch('ADD_QUANTITY', product, parent)
    }else{
        dispatch('SET_MODAL', {
            show: true,
            title: '提示',
            content: '这个菜品卖得太好了，只能加入这么多了！',
            cancelText:　'',
            confirmText: '确定',
            cancel: (obj) =>  { dispatch('SET_MODAL', { show: false}) },
            confirm: (obj) => { dispatch('SET_MODAL', { show: false}) }
        })
    }
}

//购物车中减少数量
export const cutQuantity = ({ dispatch, state }, product, parent) => {
    if (product.quantity > 0) {
        dispatch('CUT_QUANTITY', product, parent)
    }
}

//删除购物车中的商品
export const delProduct = ({ dispatch, state }, product) => {
    if (!!product.fid) {
        dispatch('DEL_PRODUCT', product)
    }
}

//添加套餐
export const addCombo = ({ dispatch, state }, product, uuid) => {
    dispatch('ADD_COMBO', product, uuid)
}

//套餐再来一份
export const addComboMore = ({ dispatch, state }, product, combo) => {
    dispatch('ADD_COMBO_MORE', product, combo)
}

//取消套餐
export const escCombo = ({ dispatch, state }, product, combo) => {
    dispatch('ESC_COMBO')
}

//修改套餐
export const editCombo = ({ dispatch, state }, uuid, product, combo) => {
    dispatch('EDIT_COMBO', uuid, product, combo)
}

//删除套餐
export const delCombo = ({ dispatch, state }, product, uuid) => {
    dispatch('DEL_COMBO', product, uuid)
}

//选择套餐菜品
export const selectComboFood = ({ dispatch, state },  row, food) => {
    dispatch('SELECT_COMBO_FOOD', row, food)
}


//显示购物车组件
export const showCart = ({ dispatch, state }) => {
    dispatch('DISPLAY_CART')
}

//展开收起购物车
export const toggleCart = ({ dispatch, state }, show) => {
    dispatch('TOGGLE_CART', show)
}

//显示隐藏MENU
export const setShowMenu = ({ dispatch, state }, show) => {
    dispatch('DISPLAY_MENU', show)
}

//显示隐藏遮罩层
export const setMask = ({ dispatch, state }, show) => {
    dispatch('DISPLAY_MASK', show)
}

//设置对话框
export const setModal = ({ dispatch, state }, option) => {
    dispatch('SET_MODAL', option)
}

//设置提示
export const setToast = ({ dispatch, state }, option) => {
    dispatch('SET_TOAST', option)
}

//提交购物车
export const checkout = ({ dispatch, state }, products) => {
    const savedCartItems = [...state.added]
    dispatch('CHECKOUT_REQUEST')

    /*shop.buyProducts(
        products,
        () => dispatch('CHECKOUT_SUCCESS),
        () => dispatch('CHECKOUT_FAILURE, savedCartItems)
    )*/
}



