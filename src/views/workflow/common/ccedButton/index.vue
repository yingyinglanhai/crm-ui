<template>
    <div class="ccedButton">
        <el-badge :value="count" class="item">
            <el-button type="primary" plain icon="el-icon-connection" size="mini" @click="openCcedDialog">抄送</el-button>
        </el-badge>
        <CcedList :billType="billType" :businessId="businessId" v-show="showStatus" :showStatus="showStatus" :readonly="readonly"
                  @closeCcedListDialog="closeDialog"
                  @setCount="setCount"
        ></CcedList>
    </div>
</template>
<script>
import {countCced,listSealApply, getSealApply, delSealApply, addSealApply, updateSealApply} from "@/api/workflow/flowCced";
import CcedList from "@/views/workflow/common/ccedButton/ccedList";
export default {
    name: "CcedButton",
    components:{CcedList},
    props: {
        billType: "",
        businessId:"",
        readonly:false,
    },
    data() {
        return {
            loading:false,
            ccedList:[],
            count:0,
            showStatus: false,
        }
    },
    created() {
        // console.log("抄送按钮条："+this.billType+","+this.businessId);
    },
    watch: {
        billType: function (newVal, oldVal) {
            if(newVal!=oldVal){
                console.log("抄送按钮条："+this.billType+","+this.businessId);
                this.getCcedCount();
            }
        }
    },
    methods:{
        getCcedCount(){
            let queryParams={
                billType:this.billType,
                businessId:this.businessId
            }
            console.log("查询抄送人人数："+JSON.stringify(queryParams));
            countCced(queryParams).then(res=>{
                if(200 == res.code){
                    this.count = res.data;
                }
            })
        },
        closeDialog(){
            this.showStatus = false;
        },
        //打开附件窗口
        openCcedDialog(){
            this.showStatus = true;
        },
        setCount(c){
            this.count = c
        }
    }
}

</script>
<style scoped lang="scss">
.ccedButton{
    display: inline-block;
    margin-left: 10px;
}
</style>
