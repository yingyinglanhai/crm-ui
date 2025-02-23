<template>
    <div id="modeleridasda" style = "height:calc(100vh - 84px)">
        <bpmn-modeler ref="refNode" :xml="xml" :users="users" :groups="groups" :categorys="categorys" :is-view="false" @save="save"/>
    </div>
</template>

<script>
import bpmnModeler from "@/views/workflow/workflowBpmnModeler";
import {getModelDesignerUserList,getModelDesignerPostList, getModelDetail, saveModel} from "@/api/workflow/modelDesigner";
export default {
    name: "ModelDesigner",
    dicts: ['oa_customform_category'],
    components: {
        bpmnModeler
    },
    data() {
        return {
            xml: "", // 后端查询到的xml
            name:"",
            description:"",
            modelId:"",
            users: [],
            groups: [],
            categorys: [],
            isView: true
        };
    },
    created() {
        //组装分类信息
        this.getCategory();
        //获取流程图xml
        const modelId = this.$route.params && this.$route.params.modelId;
        this.modelId = modelId;
        this.getModelDetail(modelId);
        //获取可选择的用户信息
        this.getModelDesignerUserList();
        //获取可选择的岗位信息
        this.getModelDesignerPostList()
    },
    methods: {
        //获取可选择的用户信息
        getModelDesignerUserList(){
            let username = this.$store.state.user.name;
            getModelDesignerUserList(username).then(res=>{
                if(200==res.code){
                    this.users = res.data;
                }
            })
        },
        //获取可选择的角色信息
        getModelDesignerPostList(){
            let username = this.$store.state.user.name;
            getModelDesignerPostList(username).then(res=>{
                if(200==res.code){
                    this.groups = res.data;
                }
            })
        },
        //获取分类信息
        getCategory(){
            this.getDicts("oa_customform_category").then(res=>{
                console.log(res);
                let categorys = [];
                if(200==res.code){
                    res.data.forEach((item,index)=>{
                        let cat = {};
                        cat.id = item.dictValue;
                        cat.name = item.dictLabel;
                        categorys.push(cat);
                    })
                }
                this.categorys = categorys;
                console.log(categorys);
            });
        },
        //获取流程图xml
        getModelDetail(modelId) {
            getModelDetail(modelId).then(res=>{
                if(200==res.code){
                    this.xml = res.data.xml;
                    this.name = res.data.name;
                    this.description = res.data.description;
                }
            })
            // 发送请求，获取xml
            // this.xml = response.xml
        },
        save(data) {
            console.log(data);  // { process: {...}, xml: '...', svg: '...' }
            saveModel(this.modelId,data).then(res=>{
                if(200==res.code){
                    this.$modal.msgSuccess("保存成功");
                }
            })
        },
    },
}
</script>

<style scoped>

</style>
