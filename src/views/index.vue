<template>
    <div class="dashboard-editor-container" >
        <panel-group @handleSetLineChartData="handleSetLineChartData"/>
    </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'
import BarLineChart from './dashboard/BarLineChart'
import OceanChart from './dashboard/OceanChart'
const lineChartData = {
    newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
    }
}

export default {
    name: 'Index',
    dicts: ['sys_notice_status', 'sys_notice_type'],
    components: {
        PanelGroup,
        LineChart,
        RaddarChart,
        PieChart,
        BarChart,
        OceanChart,
    },
    data() {
        return {
            lineChartData: lineChartData.newVisitis,
        }
    },
    created() {
        //获取最新升级
        //this.getLastUpdateList();
    },
    computed: {
        theme() {
            console.log("主题：");
            return this.$store.state.settings.theme;
        }
    },
    mounted() {

    },
    methods: {

        handleSetLineChartData(type) {
            this.lineChartData = lineChartData[type]
        },
    }
}
</script>

<style lang="scss" scoped>
// .dashboard-editor-container {
//     padding: 16px;
//     background-color: rgb(240, 242, 245);
//     position: relative;

//     .chart-wrapper {
//         background: #fff;
//         padding: 16px;
//         margin-bottom: 16px;
//     }
// }
.dashboard-editor-container {
  //padding: 10px;
  //background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
@media (max-width: 1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}
// .icon-list{
//     overflow: visible;
//     list-style: none;
//     padding: 0!important;
//     display: flex;
//     flex-direction: row;
//     flex-wrap: wrap;
//     .item {
//         display: flex;
//         flex-direction: column;
//         padding: 30px;
//         border: 1px solid #eaeefb;
//         text-align: center;
//         margin-left: -1px;
//         margin-top: -1px;
//         cursor: pointer;
//         width: 145px;
//         align-items: center;
//         i{
//             color: #606266;
//             font-size: 35px;
//         }
//         svg{
//             color: #606266;
//             font-size: 35px;
//         }
//         span{
//             padding: 20px 10px 0px 10px;
//             color: #666666;
//             font-size: 12px;
//         }

//     }
//     .item:hover{
//         background-color: var(--myTheme);
//         svg,span{
//             color: #FFFFFF;
//         }
//     }
// }

</style>
