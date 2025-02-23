<template>
    <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import {getYear, getData} from "@/api/dashboard/home/chart";


require('echarts/theme/macarons') // echarts theme

const animationDuration = 3000
const colors = ['#40cc99', '#FF7775'];
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
            colors: colors,
            xList: [],
            y1Data: [],
            y2Data: [],
            options: {
                color: this.colors,
                grid: {
                    // right: '20%'
                },
                toolbox: {
                },
                legend: {
                    data: ['进口额', '出口额']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['2022']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '进口额',
                        position: 'left',
                        alignTicks: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: colors[0]
                            }
                        },
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                    {
                        type: 'value',
                        name: '出口额',
                        position: 'right',
                        // offset: 80,
                        alignTicks: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: colors[1]
                            }
                        },
                        axisLabel: {
                            formatter: '{value} 元'
                        }
                    },
                ],
                series: [
                    {
                        name: '进口额',
                        type: 'bar',
                        data: [0]
                    },
                    {
                        name: '出口额',
                        type: 'bar',
                        yAxisIndex: 1,
                        data: [0]
                    },
                ]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getX();
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
        getX(){
            getYear().then(res=>{
                this.xList = res.data;
                this.options.xAxis[0].data = this.xList;
                this.getData();
            })
        },
        getData(){
            getData().then(res=>{
                let y1Data = [];
                let y2Data = [];
                if(res.data){
                    res.data.forEach(item => {
                        y1Data.push(item.inAmt)
                        y2Data.push(item.outAmt);
                    })
                }
                this.options.series[0].data = y1Data;
                this.options.series[1].data = y2Data;
                this.initChart();
            })
        },
        initChart() {
            this.chart = echarts.init(this.$el, 'macarons')
            this.chart.setOption(this.options);
        }
    }
}
</script>
