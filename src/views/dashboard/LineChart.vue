<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getLastYearStat} from '@/api/crm/compStat'

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
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
            this.ydata1.push(item.chanceTotal);
            this.ydata2.push(item.chanceFollowTotal); 
          }
          //设置echart
          this.setOptions();
      });

    },
    setOptions() {
      this.chart.setOption({
        title: {
            text: "商机趋势",
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
        grid: {
          left: '2%',
          right: '5%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        legend: {
          orient: 'horizontal',
          left: 'right',
          top: 'top',
          bottom: '10',
          data: ["商机", "跟进"]
        },
        xAxis: {
          data: this.xdata,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },

        series: [{
          name: '商机', 
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          data: this.ydata1,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '跟进',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.ydata2,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
