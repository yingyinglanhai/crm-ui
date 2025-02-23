<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import {getYear, getData, getPlaceData} from "@/api/dashboard/home/chart";
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
        },
    },
    data() {
        return {
            chart: null,
            option:{
                // title: {
                //     text: 'Stacked Area Chart'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    // data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                    data: ["企业数量"]
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ["绿色低碳新材料产业园", "数字经济产业园", "电子信息装备制造产业园", "高端装备制造园", "轻工业产业园"]
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '企业数量',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        // data: [120, 132, 101, 134, 90, 230, 210]
                        data: [0, 0, 0, 0, 0]
                    },
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
            this.chart = echarts.init(this.$el, 'macarons');
            getPlaceData().then(res=>{
                console.log(res)
                if(res.data){
                    res.data.forEach(item => {
                        if(item.fromPlace=='0'){
                            this.option.series[0].data[0] = item.c;
                        }
                        if(item.fromPlace=='1'){
                            this.option.series[0].data[1] = item.c;
                        }
                        if(item.fromPlace=='2'){
                            this.option.series[0].data[2] = item.c;
                        }
                        if(item.fromPlace=='3'){
                            this.option.series[0].data[3] = item.c;
                        }
                        if(item.fromPlace=='4'){
                            this.option.series[0].data[4] = item.c;
                        }
                    });
                }
                console.log(this.option.series[0].data)
                this.chart.setOption(this.option);
            })
        }
    }
}
</script>
