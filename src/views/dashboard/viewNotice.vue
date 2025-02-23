<template>
    <div style="padding: 20px">
        <div>
            <el-scrollbar class="page-scroll" style="height: 100%;">
                <!--标题-->
                <div style="padding: 10px;">
                    <div style="text-align: center; font-size: 16px; font-weight: 900;">
                        {{notice.noticeTitle}}
                    </div>
                    <div style="padding: 15px; text-indent: 2em; line-height: 32px; font-size: 16px;" v-html="notice.noticeContent">
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script>
import {getNotice} from "@/api/system/notice";

export default {
    data(){
        return {
            notice:{}
        }
    },
    props: {
        noticeId: null,
    },
    created() {
        console.log("查看通知公告："+this.noticeId);
        this.getNoticeDetail();
    },
    methods: {
        getNoticeDetail() {
            getNotice(this.noticeId).then(response => {
                this.notice = response.data;
                this.open = true;
            });
        }
    }
}
</script>
