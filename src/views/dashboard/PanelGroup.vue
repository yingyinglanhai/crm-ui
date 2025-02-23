<template>
  <div class="page-container">
    <el-row :gutter="20" class="panel-group">
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              线索
            </div>
            <count-to :start-val="0" :end-val="allStat.clueTotal" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              客户
            </div>
            <count-to :start-val="0" :end-val="allStat.customerTotal" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-tab">
            <svg-icon icon-class="tab" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              商机
            </div>
            <count-to :start-val="0" :end-val="allStat.chanceTotal" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              产品
            </div>
            <count-to :start-val="0" :end-val="allStat.productTotal" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-skill">
            <svg-icon icon-class="skill" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              合同
            </div>
            <count-to :start-val="0" :end-val="allStat.contractTotal" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              回款
            </div>
            <count-to :start-val="0" :end-val="allStat.backmoneyTotal" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="panel-group">
      <el-col :span="12">
        <div class="card-panel" style="height:320px;" >
          <BarChart />
        </div>
      </el-col>

      <el-col :span="12">
        <div class="card-panel" style="height:320px;">
          <PieChart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="panel-group">
      <el-col :span="12">
        <div class="card-panel" style="height:320px;">
            <LineChart />
        </div>
      </el-col>

      <el-col :span="12">
        <div class="card-panel" style="height:320px;">
            <BarLineChart/>
        </div>
      </el-col>

    </el-row>
</div>
</template>

<script>
import CountTo from 'vue-count-to'
import LineChart from './LineChart'
import RaddarChart from './RaddarChart'
import PieChart from './PieChart'
import BarChart from './BarChart'
import BarLineChart from './BarLineChart'
import {getAllStat} from '@/api/crm/compStat'
const lineChartData = {

}
export default {
  components: {
    CountTo,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    BarLineChart
  },
  data(){
    return {
      lineChartData: lineChartData.newVisitis,
      value: [],
      allStat:{
        clueTotal: 0,
        customerTotal: 0,
        chanceTotal: 0,
        productTotal: 0,
        contractTotal: 0,
        backmoneyTotal: 0

      },
      culeValue:0,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAllStatValue();
    })
  },
  methods: {
    getAllStatValue(){
      getAllStat().then(response => {
          const stat = response.data;
          if (stat !== undefined) {
            this.allStat.clueTotal = stat.clueTotal;
            this.allStat.customerTotal = stat.customerTotal;
            this.allStat.chanceTotal = stat.chanceTotal;
            this.allStat.productTotal = stat.productTotal;
            this.allStat.contractTotal = stat.contractTotal;
            this.allStat.backmoneyTotal = stat.backmoneyTotal;
          }
      });            
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  .card-panel-col {
    margin-bottom: 15px;
  }

  .card-panel {
    height: 85px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-radius:6px;
    //box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      box-shadow: 0 0 16px 0 rgba(0,0,0,.25);
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-tab {
        background: #34bfa3
      }
      .icon-textarea{
        background: #34bfa3
      }
      .icon-skill {
        background: #40c9c6;
      }
      .icon-shopping {
        background: #36a3f7;
      }
      .icon-tab {
        background: #f4516c;
      }
      .icon-dashboard {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-tab {
      color: #34bfa3
    }
    .icon-textarea {
      color: #34bfa3
    }
    .icon-skill {
      color: #40c9c6;
    }
    .icon-shopping {
      color: #36a3f7;
    }
    .icon-tab {
      color: #f4516c;
    }
    .icon-dashboard {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 5px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 16px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
.panel-head {
  background-color: #f0f2f5;
  margin: 0px 10px;
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 85px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    border-radius:6px;
    border-color: rgba(0, 0, 0, .05);
    .card-panel-icon-wrapper {
      float: left;
      color: #333;
      font-weight: 600;
      font-size: 16px;
      line-height: 85px;
      margin-left: 42px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
      height: 90px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 25px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

.section{
  background-color:unset;
  margin-top:10px;
}
::v-deep .section-title{
  font-size: 16px !important;

}
::v-deep .section-mark{
  height:16px !important;
  border-left-width: 6px !important;
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.page-container {
  /*padding: 10px;
  width: 100%;*/
  background-color: rgb(240, 242, 245);
  border: 1px solid #eaeffc;
  margin: 10px;
  padding: 10px;
  height: calc(100vh - 104px);
  overflow: auto;
  box-shadow: 0px 0px 12px 0px rgba(188, 188, 188, 0.36);
  .title {
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #e6ebf5;
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    align-items: center;
    .btn-area {
      -webkit-box-flex: 1;
      flex: 1;
      text-align: right;
      margin-right: 0px;
    }
    .title-icon {
      width: 6px;
      height: 20px;
      background-color: #409EFF;
      background-size: 100% 100%;
      margin: 1px 7px 0px 7px;
    }
  }
  .content-container {
    /*background: #f2f2f2;
    margin-top: 5px;*/
    padding-left: 10px;
    padding-right: 10px;

  }
}
</style>
