import Vuex from 'vuex';
import Vue from 'vue';
import middlewares from './middlewares';
import {
    setCartLocalData,
    getCartLocalData,
    updataGenresCount,
    updataProductsCount,
    updataProductAttrsCount} from './utils.js'

Vue.use(Vuex);

// 创建一个对象来保存应用启动时的初始状态
const state = {
    debug: false,
    products: [],
    genres: [],
    attrs: [],
    combo: {
        result: [],
        foods: [],
        selected:[],
        current: {
            uuid: '',
            price: 0,
            quantity: 1,
            list: []
        }
    },
    urls: [],
    cart: getCartLocalData(),
    currentView: 'cart',
    product: {},
    detailProduct: {},
    address: {},
    showMenu: false,
    showMask: false,
    showCart: false,
    transitionsName: 'fadeGo',
    toast: {
        show: true,
        text: 'loading'
    },
    modal: {
        show: false,
        title: '提示',
        content: 'TEST',
        cancelText: '取消',
        confirmText: '确定',
        cancel: () => {},
        confirm: () => {},
    },
    weixin: {
        appId: '',
        timestamp: '',
        nonceStr: '',
        signature: '',
    }
}
//创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
    //更新微新KEY
    ['RECEIVE_WEIXIN'](state, products) {
    },

    //更新商品列表
    ['RECEIVE_PRODUCTS'] (state, products) {
        state.products = products
        state.products.forEach(function(product){
            const recordProduct = state.cart.find(c => c.fid === product.fid)
            if(!!recordProduct) {
                if(!!recordProduct.aid){
                    product.quantity += recordProduct.quantity
                } else if(!!recordProduct.combos){
                    product.combos = recordProduct.combos
                    product.quantity = recordProduct.combos.length
                }else{
                    product.quantity = recordProduct.quantity
                }
            }
        })
        //if(state.debug) console.log("ACTION:", "更新产品数量{ fid: " + p.fid + ",quantity :", p.quantity+"}");
        //state.cart.sort()
        if(state.debug) console.log('CONST: 所有商品列表', state.products);
    },

    //更新分类
    ['RECEIVE_GENRES'](state, genres) {
        state.genres = genres
        state.genres.forEach(function(genre){
            var count = 0
            state.cart.forEach(function(product){
                if(product.cid === genre.cid) count+=product.quantity
            })
            genre.quantity = count
            if(state.debug) console.log("ACTION:", "更新分类数量{ cid: " + genre.cid + ",quantity :", genre.quantity+"}");
        })
        if(state.debug) console.log('CONST: 分类列表', state.genres);
    },

    //更新商品属性
    ['RECEIVE_ATTRS'] (state, attrs) {
        state.attrs = attrs
        state.cart.forEach(function(p){
            state.attrs.forEach(function(attr){
                if(attr.fid === p.fid && attr.aid === p.aid) {
                    attr.quantity = p.quantity
                }
            })
            if(state.debug) console.log("ACTION:", "更新产品属性数量{ fid: " + p.fid + ",aid: " + p.aid + ",quantity :", p.quantity+"}");
        })
        if(state.debug) console.log('CONST: 当前属性列表', state.attrs);
    },

    //更新套餐(POST)
    ['RECEIVE_COMBO'](state, combo){
        state.combo.result = combo
    },

    //套餐菜品
    ['RECEIVE_COMBO_FOODS'](state){
        state.combo.result.rows.forEach((item) => {
            item.foods.forEach((f)=>{ state.combo.foods.push(f) })
        })
    },

    //更新详情页商品
    ['RECEIVE_PRODUCT'](state, product) {
        state.detailProduct = product
        state.cart.forEach(function(p){
            if(p.fid === state.detailProduct.fid) {
                state.detailProduct.quantity += p.quantity
            }
        })
        if(state.debug) console.log('CONST: 当前商品', state.detailProduct)
    },

    //更新收货地址
    ['RECEIVE_ADDRESS'](state, address) {
        state.address = address
    },

    //增加商品数量
    ['ADD_QUANTITY'](state, product, parent) {
        if(product.type == '2') { //规格
            state.currentView = 'attr'
            state.product = product
            state.showMask = true
            if(state.debug) console.log("ACTION:", '切换模块显示为属性弹窗');
            return;
        }else if( product.type == '3' || product.type == '4' ) { //套餐
            state.currentView = 'combo'
            state.product = product
            state.showMask = true
            if(state.debug) console.log("ACTION:", '切换模块显示为固定套餐');
            return;
        }else{

            const recordCart = !product.aid ? state.cart.find(p => p.fid === product.fid) : state.cart.find( p => p.fid === product.fid && p.aid === product.aid)

            if (!recordCart) {
                state.cart.push({
                    cid: product.cid,
                    fid: product.fid,
                    aid: product.aid,
                    type: product.type,
                    title: product.title,
                    parentTitle: parent!==undefined ? parent.title : '',
                    price: product.price,
                    inventory: product.inventory,
                    quantity: 1,
                    combos: [],
                    hasattr: product.hasattr,
                })
                state.detailProduct.quantity += 1
                if(state.debug) console.log("ACTION:", "添加商品到购物车", !product.aid ? ("{fid: "+ product.fid + "}") : ("{fid: "+ product.fid+", aid: "+product.aid + "}"));
            }else {
                recordCart.quantity++
                state.detailProduct.quantity++
                if(state.debug) console.log("ACTION:", "增加商品数量", !product.aid ? ("{fid: " + recordCart.fid + ",quantity:" + recordCart.quantity + "}") : ("{fid: " + recordCart.fid + ", aid: " + recordCart.aid + ",quantity:" + recordCart.quantity + "}"));
            }

            const recordProducts = state.products.find(p => p.fid === product.fid)
            const attr   = state.attrs.find(p => p.fid === product.fid && p.aid === product.aid)

            if(!product.hasattr ) {
                if(!!product.aid) {
                    if(attr!==undefined){
                        attr.quantity++
                        attr.inventory--
                    }
                    if(recordProducts!==undefined) recordProducts.quantity++
                    if(recordProducts!==undefined) recordProducts.inventory--
                }else{
                    if(recordProducts!==undefined) recordProducts.quantity++
                    if(recordProducts!==undefined) recordProducts.inventory--
                }
            }

            //更新分类数量
            updataGenresCount(state.genres, state.cart)
            //将购物车保存到本地
            setCartLocalData(state.cart)
        }

        if(state.debug) console.log("CONST:", "购物车列表", state.cart);
    },

    //减少商品数量
    ['CUT_QUANTITY'](state, product) {
        if(product.hasattr) {
            state.currentView = 'attr'
            state.product = product
            state.showMask = true
            if(state.debug) console.log("ACTION:", '切换模块显示为属性弹窗');
            return;
        }
        const recordCart = !product.aid ? state.cart.find(p => p.fid === product.fid) :
                    state.cart.find(p => p.fid === product.fid && p.aid === product.aid)
        recordCart.quantity--
        state.detailProduct.quantity--
        if(state.debug) console.log("ACTION:", "减小商品数量", !product.aid ? ("{fid: "+ recordCart.fid + ",quantity:" + recordCart.quantity + "}") : ("{fid: "+ recordCart.fid+", aid: "+recordCart.aid + ",quantity:" + recordCart.quantity + "}"));
        if(recordCart.quantity === 0) {
            if(state.debug) console.log("ACTION:", '删除购物车中的商品 { fid: ', recordCart.fid, '}');
            state.cart.$remove(recordCart)
        }

        const recordProducts = state.products.find(p => p.fid === product.fid)
        const attr   = state.attrs.find(p => p.aid === product.aid)

        if(!product.hasattr) {
            if(!!product.aid) {
                if(attr!==undefined){
                    attr.quantity--
                    attr.inventory++
                }
                if(recordProducts!==undefined) recordProducts.quantity--
                if(recordProducts!==undefined) recordProducts.inventory++
            }else{
                if(recordProducts!==undefined) recordProducts.quantity--
                if(recordProducts!==undefined) recordProducts.inventory++
            }
        }

        //更新分类数量
        updataGenresCount(state.genres, state.cart)
        //将购物车保存到本地
        setCartLocalData(state.cart)
    },

    //删除商品
    ['DEL_PRODUCT'](state, product) {
        const record = state.cart.find(p => p.fid === product.fid)
        if(state.debug) console.log("ACTION:", '删除购物车中的商品 { fid: ', product.fid, '}');
        state.cart.$remove(record)
    },

    //选择套餐菜品
    ['SELECT_COMBO_FOOD'](state, row, food){

        let self = this, inTemp = false, item = null, index = 0, price = 0

        state.combo.current.list.forEach( (p, i) => {
            if(p.title === row.title){
                inTemp = true
                index = i
            }
        })

        const refood =  state.combo.current.list.length > 0 ? state.combo.current.list[index].foods.find( p => p.fid === food.fid) : false

        if(!refood){
            if(inTemp){
                console.log("ROW - old")
                state.combo.current.list[index].foods.push(food)
                state.combo.selected.push(food.fid)
            }else{
                console.log("ROW - new")
                item = {}
                item.title = row.title
                item.foods = [food]
                state.combo.current.list.push(item)
                state.combo.selected.push(food.fid)
            }
            console.log("选中行:", row.title, '菜品FID:', food.fid, state.cart);
        }else{
            state.combo.current.list[index].foods.$remove(refood)
            state.combo.selected.$remove(food.fid)
            console.log("取消选中行:", row.title, '菜品FID:', food.fid);
        }

        //计算套餐价格
        if(state.product.type == "4"){ //组合
            if(!refood){
                price += food.price
            }else{
                price -= food.price
            }
        }else{//固定
            price = state.product.price
        }
        state.combo.current.price = price

        //根据fid排序菜品
        state.combo.current.list[index].foods.sort((a, b) => {return a.fid - b.fid})

        //console.log(row.title, row.require, index)


        /*
        if(isSelected) { //选中
            if(isHas){
                console.log("选中1", indexs)
                state.combo.current.list[indexs].foods.push(record)
            }else{
                console.log("选中0", indexs)
                state.combo.current.list.push({ title: item.title, foods: [record]})
            }
            if(item.require < state.combo.current.list[indexs].foods.length){ //如果选中的等于必选，去掉一个
                console.log("选中2", state.combo.current.list[indexs].foods.length)
                state.combo.current.list[indexs].foods.$remove(state.combo.current.list[indexs].foods[0])
            }
        }else{//取消选中
            let currentFood = state.combo.current.list[indexs].foods[getIndexToArray(record.fid, state.combo.current.list[indexs].foods)]
            console.log("取消选中", record.fid, indexs, currentFood)
            state.combo.current.list[indexs].foods.$remove(currentFood)
            if(state.combo.current.list[indexs].foods.length === 0) {
                state.combo.current.list.$remove(state.combo.current.list[indexs])
            }
        }*/
    },

    //套餐添加
    ['ADD_COMBO'](state, product, uuid) {
        state.combo.current.uuid = uuid
        const recordCart = state.cart.find( p => p.fid === product.fid)
        const recordProduct = state.products.find(p => p.fid === product.fid)

        console.log("列表中的菜品：",recordProduct)
        if(!recordCart){
            state.cart.push({
                cid: product.cid,
                fid: product.fid,
                aid: product.aid,
                type: product.type,
                title: product.title,// +'(' + comboTitle.join('+') + ')',
                price: product.price,
                inventory: product.inventory,
                test: true,
                quantity: 1,
                combos: [state.combo.current]
            })
            state.detailProduct.quantity += 1
            recordProduct.quantity = 1
            recordProduct.combos = [state.combo.current]
        }else{
            console.log("UUID:",uuid)
            var ischecked = false, index = ''
            recordCart.combos.forEach( (item, i) => {
                if(item.uuid === uuid) {
                    ischecked = true
                    index = i
                }
            })
            console.log("ischecked", ischecked)
            if(!ischecked) {
                console.log("ACTION:", '新增套餐-', state.combo.current)
                recordCart.combos.push(state.combo.current)
                recordCart.quantity++
                recordCart.inventory--
                console.log("111111111111",recordCart.combos)
                /*recordProduct.combos.push(state.combo.current)*/
                recordProduct.quantity++
                recordProduct.inventory--
                //console.log("22222222222",recordCart.combos)
            }else{
                console.log("ACTION:", '修改套餐-', state.combo.current)
                recordCart.combos.$set(index, state.combo.current)
                recordProduct.combos.$set(index, state.combo.current)
            }
        }
        //重置套餐
        state.combo.current = {uuid: '',genre: 0, price: 0, quantity: 1, list: []}
        state.combo.foods = []
        state.combo.selected = []

        //将购物车保存到本地
        setCartLocalData(state.cart)
        //更新分类数量
        updataGenresCount(state.genres, state.cart)
    },

    //套餐再来一份
    ['ADD_COMBO_MORE'](state, product, combo){
        state.currentView = 'combo'
        state.product = product
        state.showMask = true

        state.combo.selected = []
        combo.list.forEach((item, i)=>{
            state.combo.current.list.push({title: item.title, foods: []})
            item.foods.forEach((f)=>{
                state.combo.current.list[i].foods.push(f)
                state.combo.selected.push(f.fid)
            })
        })
        console.log("选中的菜品：", state.combo.selected)
    },

    //修改套餐
    ['EDIT_COMBO'](state, uuid, product, combo){
        state.currentView = 'combo'
        state.product = product
        state.showMask = true

        state.combo.selected = []
        state.combo.current.uuid = uuid
        combo.list.forEach((item, i)=>{
            state.combo.current.list.push({title: item.title, foods: []})
            item.foods.forEach((f)=>{
                state.combo.current.list[i].foods.push(f)
                state.combo.selected.push(f.fid)
            })
        })
        console.log("选中的菜品：", state.combo.selected)
    },

    //删除套餐
    ['DEL_COMBO'](state, product, uuid){
        const recordCart = state.cart.find( p => p.fid === product.fid)
        const recordProduct = state.products.find(p => p.fid === product.fid)
        if(recordCart.combos.length){
            recordCart.combos.$remove( recordCart.combos.find( f => f.uuid === uuid) )
            recordProduct.combos.$remove( recordProduct.combos.find( f => f.uuid === uuid) )
            recordCart.quantity--
            recordCart.inventory++
            const recordProducts = state.products.find(p => p.fid === product.fid)
            recordProducts.quantity--
            recordProducts.inventory++
        }

        //更新购物车
        setCartLocalData(state.cart)
        //更新分类数量
        updataGenresCount(state.genres, state.cart)
    },

    //取消套餐
    ['ESC_COMBO'](state){
        state.combo.current = {uuid: '',genre: 0, price: 0, quantity: 1, list: []}
        state.combo.foods = []
        state.combo.selected = []
    },

    //显示购物车
    ['DISPLAY_CART'](state, product){
        state.currentView = 'cart'
        state.showMask = false
        if(state.debug) console.log("ACTION:", '切换模块显示为购物车');
    },

    //设置对话框
    ['SET_MODAL'](state, option){
        if( option.show !== undefined ) state.modal.show = option.show
        if( option.title !== undefined ) state.modal.title = option.title
        if( option.content !== undefined ) state.modal.content = option.content
        if( option.cancelText !== undefined ) state.modal.cancelText = option.cancelText
        if( option.confirmText !== undefined ) state.modal.confirmText = option.confirmText
        if( option.cancel !== undefined ) state.modal.cancel = (obj) => { option.cancel(obj) }
        if( option.confirm !== undefined ) state.modal.confirm = (obj) => { option.confirm(obj) }
    },

    //设置提示
    ['SET_TOAST'](state, option) {
        if( option.show !== undefined ) state.toast.show = option.show
        if( option.text !== undefined ) state.toast.text = option.text
    },

    //展开收起购物车
    ['TOGGLE_CART'](state, show){
        if(show) {
            state.showCart = true
        }else{
            state.showCart = false
        }
        if(state.debug) console.log("ACTION:", show ? '展开购物车' : '收起购物车');
    },

    //展开收起MENU
    ['DISPLAY_MENU'](state, show){
        if(show) {
            state.showMenu = true
        }else{
            state.showMenu = false
        }
        if(state.debug) console.log("ACTION:", show ? '展开MENU' : '收起MENU');
    },

    //显示遮罩层
    ['DISPLAY_MASK'](state, show){
        if(show) {
            state.showMask = true
        }else{
            state.showMask = false
            if(state.showCart) {
                state.showCart = false
            }
            if(state.currentView === 'attr') {
                state.currentView = 'cart'
            }
        }
    },

    //提交购物车 清空购物车
    ['CHECKOUT_REQUEST'] (state) {
        state.cart = []
    },
}

/* eslint-disable no-new */
export default new Vuex.Store({
    state,
    mutations,
    strict: process.env.NODE_ENV !== 'production',
    middlewares,
});
