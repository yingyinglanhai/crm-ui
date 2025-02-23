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
      ydata2:[],
      ydata3:[]
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
            this.ydata1.push(item.contractTotal);
            this.ydata2.push(item.backmoneyTotal); 
            this.ydata3.push(item.planBackmoneyTotal);
          }
          //设置echart
          this.setOptions();
      });
    },
    setOptions(){
      this.chart.setOption({
        title: {
            text: "合同回款",
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
          data: ["合同", "回款","计划回款"]
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
          name: '合同',
          type: 'bar',
          itemStyle: { // 设置柱状图的颜色
            color: '#3399FF' // 或者其他颜色值
          },
          data: this.ydata1,
        }, 
        {
          name: '回款',
          type: 'bar',
          barGap: 0,
          itemStyle: { // 设置柱状图的颜色
            color: '#2ecc71' // 或者其他颜色值
          },
          data: this.ydata2,
        },
        {
          name: '计划回款',
          type: 'line',
          itemStyle: { // 设置折线图的颜色
            color: '#FF6633' // 或者其他颜色值
          },
          lineStyle: { // 如果需要单独设置折线的颜色（区别于折点的颜色）
            color: '#FF6633' // 与itemStyle.color保持一致或设置不同颜色以达到期望效果
          },
          data: this.ydata3,
        }]
      })
    }
  }
}
</script>
