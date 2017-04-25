<template>
    <div class="popup-picker">

        <div class="item" @click="onClick">
            <div class="clearfix" v-if="genre === 'address' ">
                <label for="address">{{{title}}}</label>
                <span class="picker-arrow"><i class="icon icon-keyboard_arrow_right"></i></span>
                <span class="picker-value" v-if="!showName && value.length">{{value | array2string}}</span>
                <span class="picker-name" v-else="showName && value.length">{{value | value2name list}}</span>
                <span class="picker-placeholder" v-if="!value.length && placeholder" v-html="placeholder"></span>
            </div>
            <div class="clearfix" v-if="genre === 'dataTime' ">
                <label for="address">{{{title}}}</label>
                <span class="picker-arrow"><i class="icon icon-keyboard_arrow_right"></i></span>
                <span class="picker-name">{{value | formatdate 'yyyy/MM/dd'}}</span>
                <span class="picker-placeholder" v-if="!value.length && placeholder" v-html="placeholder"></span>
            </div>
            <div class="clearfix" v-if="genre === '' ">
                <label for="address">{{{title}}}</label>
                <span class="picker-arrow"><i class="icon icon-keyboard_arrow_right"></i></span>
                <span class="picker-name">{{value}}</span>
                <span class="picker-placeholder" v-if="!value.length && placeholder" v-html="placeholder"></span>
            </div>
        </div>

        <picker :show.sync="showPicker" :data="pickerData" :columns="columns" :value.sync="value" :unit="unit" ></picker>

        <div class="popup-picker-mask" v-show="showPicker" v-tap="showPicker=false"></div>
    </div>
</template>

<script>
import Picker from './picker.vue'
export default {
    components: {Picker},
    props: {
        //类型
        genre: {
            type: String,
            default: '',
        },
        //列数
        columns: {
            type: Number,
            default: 1
        },
        //标题
        title: {
            type: String,
            default: '标题',
        },
        //默认显示内容
        placeholder: String,
        //默认值
        value: {
            type: Array,
            twoWay: true
        },
        //数据
        list: {
            type: Array,
        },
        unit: {
            type: Array,
            default: ()=>[]
        },
    },
    data(){
        return {
            showPicker: false,
            showName: true,
            pickerData: [],
        }
    },
    methods: {
        onClick(){
            let self = this
            self.showPicker = true

            if(self.genre === 'address'){

                let shen = [], shi = [], qu = [];
                self.pickerData = []
                if(self.value.length){
                    self.list.forEach(function(v){
                        if(v.parent===undefined) {
                          //  console.log("======shen=======",v)
                            shen.push(v)
                        }
                        if(self.value.length && self.value[0] === v.parent){
                            shi.push(v)
                        }
                        if(self.value.length && self.value[1] === v.parent ){
                            qu.push(v)
                        }
                    })
                } else {
                    self.list.forEach(function(v){
                        if(v.parent===undefined) {
                            shen.push(v)
                        }
                        if(shen[0].value === v.parent) {
                            shi.push(v)
                        }
                        if(shi.length && shi[0].value === v.parent) {
                            qu.push(v)
                        }
                    })
                }
                self.pickerData.push(shen)
                self.pickerData.push(shi)
                self.pickerData.push(qu)
            }
            else if(self.genre === 'dataTime'){
                let year = [], month = [], date = [];
                self.pickerData = []
                for (var i = 1; i <= 30; i++) {
                    year.push(2000+i)
                }
                for (let i = 1; i <= 12; i++) {
                    month.push(this.numPad(i, 2))
                }
                let maxDate = this.getDaysInMonth(parseInt(year[0]), Number(month[0]))
                for (let i = 1; i <= maxDate ; i++) {
                    date.push(this.numPad(i, 2))
                }
                self.pickerData.push(year)
                self.pickerData.push(month)
                self.pickerData.push(date)
            }else{
                self.pickerData = self.list
                self.pickerData.sort()
            }
        },
        getDaysInMonth(year,month){
            month = parseInt(month,10);
            var temp = new Date(year,month,0);
            return temp.getDate();
        },
        //数字补0
        numPad(num, n) {
            var len = num.toString().length;
            while(len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        },
    },
    events: {
        'on-change': function (val, index) {
            console.log("传入的参数：",val, index)
            let self = this
            if(self.genre === 'address'){
                this.pickerData[index+1] = this.list.filter(function(v){
                    return v.parent === val
                })
            }
            else if(self.genre === 'dataTime'){
                if(index === 1){
                    let date = [], max = this.getDaysInMonth('2016', val)
                    for (let i = 1; i <= max; i++) {
                        date.push(this.numPad(i, 2))
                    }
                    this.pickerData[index+1] = date
                }
            }
            else{}
        },
    },
    ready(){
        let self = this
        if(self.genre === 'dataTime') {
            var today  = new Date().getDate(), //当前天
                tmonth = new Date().getMonth()+1,//当前月份
                tyear  =  new Date().getFullYear();//当前年份
                self.value = [tyear, tmonth, today]
        }
        console.log("columns",this.columns)
    }
}
</script>

<style lang="less" scope>
.popup-picker {
    .item {
        box-sizing: border-box; padding-left: 1rem; border-bottom: 1px solid #ccc; background: #fff; line-height: 4rem;
        label{ float: left; width: 30%; }
        span { float: right; font-size: 1.4rem; }
        input { float: right; border: 0; width: 70%; height: 4rem; font-size: 1.4rem; padding-right: 1rem; text-align: right; }
    }
    .picker-arrow {
        color: #ddd; i { font-size: 18px; vertical-align: middle; }
    }
    .popup-picker-mask {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
    }
}
</style>
