<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import {getProjectYear, getProjectCount} from "@/api/dashboard/home/chart";
require('echarts/theme/macarons') // echarts theme

const animationDuration = 3000

export default {
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
            default: '500px'
        }
    },
    data() {
        return {
            chart: null,
            options:{
                legend: {
                    data: ['项目数量']
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: '项目数量',
                },
                series: [
                    {
                        name: '项目数量',
                        data: [],
                        type: 'bar'
                    }
                ]
            }
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

            getProjectYear().then(res=>{
                if(res.data){
                    this.options.xAxis.data = res.data;
                    getProjectCount().then(res=> {
                        if (res.code === 200) {
                            let arr = [];
                            res.data.forEach(item => {
                                arr.push(item.c);
                            })
                            this.options.series[0].data = arr;
                            this.chart = echarts.init(this.$el, 'macarons')
                            this.chart.setOption(this.options)
                        }
                    })
                }
            })
        }
    }
}
</script>
