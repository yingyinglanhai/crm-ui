<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getClueDistribe} from '@/api/crm/compStat'

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
      legend:[],
      data:[]
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
      getClueDistribe().then(response => {
          for(let item of response.data){
            this.legend.push(item.k);
            var jobj = {name: item.k,value: item.v1}; 
            this.data.push(jobj);
          }
          debugger
          //设置echart
          this.setOptions();
      });
    },
    setOptions(){
      this.chart.setOption({
        title: {
            text: "线索分布",
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
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'top',
          bottom: '10',
          data: this.legend
        },
        series: [
          {
            name: '线索分布',
            type: 'pie',
            top: '40%',
            roseType: false,
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
