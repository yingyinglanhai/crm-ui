<template>
    <div class="avatar">
        <el-badge :value="messageCount" :max="99" class="message" :hidden="messageCount==0" v-if="!util.isEmpty(avatar)">
            <el-avatar :size="size" :src="baseUrl+avatar">
                <el-avatar :size="size" :style="`font-size: 20px;background-color: ${extractColorByName(nickName)}`" >
                    {{util.isEmpty(nickName)?"空":nickName.substr(0,1)}}
                </el-avatar>
            </el-avatar>
        </el-badge>

        <el-badge :value="messageCount" :max="99" class="message" :hidden="messageCount==0" v-if="util.isEmpty(avatar)">
            <el-avatar :size="size" :style="`font-size: 20px;background-color: ${extractColorByName(nickName)}`" >
                {{util.isEmpty(nickName)?"空":nickName.substr(0,1)}}
            </el-avatar>
        </el-badge>

    </div>
</template>
<script>

export default {
    name: "PLAvatar",
    props: {
        avatar: {
            type: String,
            default: "",
        },
        nickName:{
            type: String,
            default: "",
        },
        size:{
            type: Number,
            default: 60,
        },
        messageCount:{
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API,
        }
    },
    methods:{
        extractColorByName(name) {
            var temp = [];
            temp.push("#");
            if(name){
                for (let index = 0; index < name.length; index++) {
                    temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16));
                }
                return temp.slice(0, 5).join('').slice(0, 4);
            }else{
                return "#666";
            }


        },
    }
}
</script>
