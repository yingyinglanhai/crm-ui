<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getLastYearStat} from '@/api/crm/compStat'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      xdata:[],
      ydata1:[],
      ydata2:[]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      getLastYearStat().then(response => {
          for(let item of response.data){
            this.xdata.push(item.statDate);
            this.ydata1.push(item.clueTotal);
            this.ydata2.push(item.customerTotal); 
          }
          console.log(this.xdata);
          //设置echart
          this.setOptions();
      });
    },
    setOptions(){
      this.chart.setOption({
        title: {
            text: "线索转化",
            left: "left",
            top: "top",
            textStyle: {
              fontSize: 20,
              color: '#000000'
            },
            subtextStyle: {
              fontSize: 20
            }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'right',
          top: 'top',
          bottom: '10',
          data: ["线索", "客户"]
        },
        grid: {
          top: '15%',
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.xdata,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '线索',
          type: 'bar',
          barGap: 0,
          data: this.ydata1,
          animationDuration,
          itemStyle: { // 设置柱子颜色
            color: '#3498db' // pageA柱子的颜色，例如蓝色
          }
        }, {
          name: '客户',
          type: 'bar',
          data: this.ydata2,
          animationDuration,
          itemStyle: { // 设置柱子颜色
            color: '#2ecc71' // pageB柱子的颜色，例如红色
          }
        }]
      })
    }
  }
}
</script>
