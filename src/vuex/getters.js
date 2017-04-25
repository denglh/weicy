// 这个 getter 函数会返回 state 的值

//获取微信KEY
export const getWeixin = (state) => state.weixin

//返回所有商品列表
export const getProducts = (state) => state.products

//返回当前菜品
export const getProduct = (state) => state.product

//返回商品详情信息
export const getDetailProduct = (state) => state.detailProduct

//返回分类列表
export const getGenres = (state) =>  state.genres

//返回属性列表
export const getAttrs = (state) => state.attrs

//返回固定套餐内容
export const getCombo = (state) => state.combo.result

export const getComboSelected =(state) => state.combo.selected


export const getCurrentCombo = (state) => state.combo.current

//返回购物车列表
export const getCart = (state) => state.cart


//返回收货地址信息
export const getAddress = (state) => state.address

//返回component当前展示状态
export const getCurrentVue = (state) => state.currentView

//返回MENU状态
export const getshowMenu = (state) => state.showMenu

//返回Mask状态
export const getShowMask = (state) => state.showMask

//返回购物车状态
export const getShowCart = (state) => state.showCart


export const getModal = (state) => state.modal

export const getToast = (state) => state.toast

