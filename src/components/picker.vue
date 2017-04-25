<template>
    <div class="picker-wrapper" v-show="show" transition="bounce">
        <div class="picker-container">
            <div class="picker-header clearfix">
                <button class="btn-cancel" @click="hidePicker(false)">取消</button>
                <span></span>
                <button class="btn-confirm" @click="hidePicker(true)">确定</button>
            </div>
            <div class="picker-body">
                <div class="picker-item" v-for="(index, item) in data">
                    <div class="vux-picker-item" id="vue-picker-{{uuid}}-{{index}}"></div>
                </div>
            </div>
            <div class="picker-footer"></div>
        </div>
    </div>
</template>

<script>
import Scroller from '../libs/scroller'
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        data: {
            type: Array,
        },
        value: {
            type: Array,
            twoWay: true
        },
        columns: {
            type: Number,
        },
        unit: {
            type: Array,
            default: []
        },
    },
    data(){
        return {
            scroller: [],
            template: '<div class="scroller-component" data-template="temp" data-role="component">\
                <div class="scroller-mask" data-role="mask"></div>\
                <div class="scroller-indicator" data-role="indicator"></div>\
                <div class="scroller-unit" data-role="unit"></div>\
                <div class="scroller-content" data-role="content"></div>\
            </div>',
            uuid: Math.random().toString(36).substring(3, 8)
        }
    },
    methods: {
        getId (i) {
            return `#vue-picker-${this.uuid}-${i}`
        },
        render (data, value) {
            const self = this
            if (!data || !data.length)  return;
            let count = this.data.length
            this.count = count
            //设置第一个为默认值
            console.log("设置第一个为默认值",value.length, count)
            if (value.length < count) {
                for (let i = 0; i < count; i++) {
                    //self.value.$set(i, data[i][0].value || data[i][0])
                }
            }
            for (let i = 0; i < data.length; i++) {
                if (!document.querySelector(self.getId(i))) return
                self.scroller[i] && self.scroller[i].destroy()
                //实例化滚动
                self.scroller[i] = new Scroller(self.getId(i), {
                    data: data[i],
                    defaultValue: value[i] || data[i][0].value,
                    template: self.template,
                    unit: self.unit[i],
                    onSelect (value, name) {
                        //self.value.$set(i, value )
                        self.$dispatch('on-change', value, i)
                        if (self.columns !== 0) {
                            self.renderChain(i + 1)
                        }
                    }
                })
                //选中默认
                if (self.value) {
                    self.scroller[i].select(value[i])
                }
            }
        },
        renderChain (i) {
            if (this.columns === 0) return
            if (i > this.count - 1) return
            const self = this
            // destroy old one
            this.scroller[i].destroy()
            this.scroller[i] = new Scroller(self.getId(i), {
                data: self.data[i],
                template: self.template,
                unit: self.unit[i],
                onSelect (value, name) {
                    //self.value.$set(i, value)
                    self.$dispatch('on-change', value, i)
                    self.renderChain(i + 1)
                }
            })
            let v = self.data[i][0].value!==undefined ? self.data[i][0].value : self.data[i][0]
            this.$dispatch('on-change', v, i)
            this.renderChain(i + 1)
        },
        getSelected(){
            let data = []
            for (let i = 0; i < this.scroller.length; i++) {
                if (this.scroller[i]) {
                    data.push(this.scroller[i].value)
                } else {
                    return []
                }
            }
            console.log(data)
            return data;
        },
        hidePicker(type){
            this.show = false
            if(type){
                this.value = this.getSelected()
            }
            for (var i = 0; i < this.scroller.length; i++) {
                this.scroller[i] && this.scroller[i].destroy()
            }
        }
    },
    watch: {
        value (val, oldVal) {
            console.log("=========22=======",val, this.data)
            // render all the scroller for chain datas
            //this.$dispatch('on-change', this.getValue())
            /*console.log(val, oldVal)
            if (this.columns !== 0) {
                if (val !== oldVal) {
                  this.data = this.store.getColumns(val)
                  console.log("render all the scroller for chain datas")
                  this.$nextTick(function () {
                    this.render(this.data, val)
                  })
                }
            } else {
                for (let i = 0; i < val.length; i++) {
                  if (this.scroller[i].value !== val[i]) {
                    this.scroller[i].select(val[i])
                  }
                }
            }*/
        },
        data(newData){
            console.log("==========1============")
            if (Object.prototype.toString.call(newData[0]) === '[object Array]') {
                this.$nextTick(() => {
                    this.render(newData, this.value)
                })
            }
        }
    },
    ready () {
        this.$nextTick(() => {
            this.render(this.data, this.value)
        })
    },
    beforeDestroy () {
        for (let i = 0; i < this.count; i++) {
          this.scroller[i].destroy()
          this.scroller[i] = null
        }
    }
}
</script>

<style lang="less" scope>
    .picker-wrapper {
        position: fixed; z-index: 1001;
        bottom: 0;
        width: 100%;
    }
    .picker-container {
        position: relative; z-index: 1002;
        width: 100%;
        margin: 0px auto;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .5);
        transition: all .3s ease;
    }
    .picker-header {
        padding: 0px;
        font-size: 1.6rem;
        background: #F8F8F8;
        border-bottom: 1px solid #ddd;
        button { float: left; width: 100px; height: 40px; border: 0; background: transparent; }
        .btn-confirm { float: right; color: #41B883; }
    }
    .picker-body {
        display: flex;
        box-align: center;
        flex-direction: row;
        box-orient: horizontal;
        box-direction: normal;
    }
    .picker-item {
        flex: 1;
        min-width: 20px;
        width: 0;
    }
    .scroller-component {
        display: block;
        position: relative;
        height: 238px;
        overflow: hidden;
        width: 100%;
    }
    .scroller-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 2;
    }
    .scroller-mask {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        margin: 0 auto;
        width: 100%;
        z-index: 3;
        background-image:linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.6)),linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.6));
        background-position: top, bottom;
        background-size: 100% 102px;
        background-repeat: no-repeat;
    }
    .scroller-item {
        text-align: center;
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        color: #000;
        line-clamp: 1;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .scroller-indicator {
        width: 100%;
        height: 34px;
        position: absolute;
        left: 0;
        top: 102px;
        z-index: 1;
        background:#f8f8f8;
        background-image:linear-gradient(to bottom, #d0d0d0, #d0d0d0, transparent, transparent),linear-gradient(to top, #d0d0d0, #d0d0d0, transparent, transparent);
        background-position: top, bottom;
        background-size: 100% 1px;
        background-repeat: no-repeat;
    }
    .scroller-unit {
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        text-indent: 5rem;
        position: absolute;
        left: 0;
        top: 102px;
        z-index: 1;
    }
    .scroller-item-selected {
        font-size: 14px;
    }
</style>
