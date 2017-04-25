<template>
    <div class="picker-address" data-address="{{value}}">
        <div class="item clearfix" @click="onClick">
            <label for="address">{{title}}：</label>
            <span class="right picker-address-name">{{value | formatdate 'yyyy-MM-dd'}}</span>
            <span class="right picker-address-placeholder" v-if="!value.length && placeholder" v-html="placeholder"></span>
        </div>
        <picker :show.sync="showPicker" :data="dataTime" :columns="columns" :value.sync="value" ></picker>

        <div class="mask picker-mask" v-show="showPicker" v-tap="showPicker=false"></div>
    </div>
</template>

<script>
import Picker from './picker.vue'
export default {
    components: {Picker},
    props: {
        title: {
            type: String,
            default: '地址',
        },
        startDate: {
            type: Array,
        },
        endDate:{
            type: Array,
        },
        value: {
            type: Array,
            twoWay: true
        },
        columns: {
            type: Number,
        },
        placeholder: String,
    },
    data(){
        return {
            showPicker: false,
            dataTime: [],
        }
    },
    methods: {
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
        onClick(){
            let self = this
            self.showPicker = true
            let year = [], month = [], date = [];
            self.dataTime = []
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
            self.dataTime.push(year)
            self.dataTime.push(month)
            self.dataTime.push(date)
        },
    },
    events: {
        'on-change': function (val, index) {
            console.log("传入的参数：",val, index)
            if(index === 1){
                let date = [], max = this.getDaysInMonth('2016', val)
                for (let i = 1; i <= max; i++) {
                    date.push(this.numPad(i, 2))
                }
                this.dataTime[index+1] = date
            }

        },
    },
    created(){
        var today  = new Date().getDate(), //当前天
            tmonth = new Date().getMonth()+1,//当前月份
            tyear  =  new Date().getFullYear();//当前年份
        this.value = [tyear, tmonth, today]
    },
}
</script>

<style lang="less" scope>
.right {
    font-size: 1.4rem;
    padding-right: 1rem;
}
.picker-address-placeholder {color:#A9A9A9;}
.mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
}
</style>
