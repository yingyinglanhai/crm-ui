<template>
        <el-dialog :visible.sync="showStatus" title="附件" width="1000px" append-to-body :before-close="beforeClose" class="commitTask">

            <el-row :gutter="10" class="mb8" v-if="!readonly">
                <el-col :span="1.5">
                    <el-upload :action="uploadFileUrl"
                        :before-upload="handleBeforeUpload"
                        :on-error="handleUploadError"
                        :on-success="handleUploadSuccess"
                        :show-file-list="false"
                        :headers="headers"
                        class="upload-file-uploader"
                        ref="upload"
                        :data="form"
                    >
                        <!-- 上传按钮 -->
                        <el-button size="mini" type="primary">上传文件</el-button>
                    </el-upload>
                </el-col>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="sysAttachmentList">
                <el-table-column label="文件" align="center" prop="url" width="100">
                    <template slot-scope="scope">
                        <el-image style="width: 50px; height: 50px" :src="getFileImage(scope.row.url)" fit="fill"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="文件名" align="center" prop="url" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{getFileName(scope.row.url)}}
                    </template>
                </el-table-column>
                <el-table-column label="文件大小" align="center" prop="size"  width="100">
                    <template slot-scope="scope">
                        {{(scope.row.size / 1024 / 1024).toFixed(2)}}MB
                    </template>
                </el-table-column>
                <el-table-column label="扩展名" align="center" prop="ext" width="80"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-download" @click="downloadFile(scope.row)">下载</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="!readonly">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
</template>

<script>
import { listSysAttachment, getSysAttachment, delSysAttachment,formAttachmentlist } from "@/api/common/sysAttachment";
import {getToken} from "@/utils/auth";

export default {
    name: "SysAttachment",
    props: {
        businessId:"",
        billType:"",
        showStatus:false,
        readonly:false
    },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 附件中心表格数据
            sysAttachmentList: [],
            number: 0,
            uploadList: [],
            baseUrl: process.env.VUE_APP_BASE_API,
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/sysAttachment/upload", // 通用上传文件
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            fileSize: 100,
            queryParams:{
                orderByColumn:"createTime",
                isAsc:"descending",
                businessId: this.businessId,
                billType: this.billType
            },
            form:{
                businessId: this.businessId,
                billType: this.billType
            }
        };
    },
    created() {
        this.getList();
        console.log("附件列表："+this.billType);
    },
    methods: {
        /** 查询附件中心列表 */
        getList() {
            this.loading = true;
            formAttachmentlist(this.queryParams).then(response => {
                this.sysAttachmentList = response.data;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal.confirm('是否确认删除附件？').then(function() {
                return delSysAttachment(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        beforeClose(){
            this.$emit('closeSysAttachmentDialog');
        },
        downloadFile(row){
            window.open(this.baseUrl + row.url);
        },





        //  获取文件缩略图
        getFileImage(name){
            let ext = this.getFileExt(name);
            console.log("文件扩展名为："+ext);
            if(ext){
                let lowExt = ext.toLowerCase();
                if(lowExt=="doc"||lowExt=="docx"){
                    return require('@/assets/images/am/filext/DOC.png');
                }else if(lowExt=="pdf"){
                    return require('@/assets/images/am/filext/PDF.png');
                }else if(lowExt=="ppt"){
                    return require('@/assets/images/am/filext/PPT.png');
                }else if(lowExt=="psd"){
                    return require('@/assets/images/am/filext/PSD.png');
                }else if(lowExt=="txt"){
                    return require('@/assets/images/am/filext/TXT.png');
                }else if(lowExt=="vsd"){
                    return require('@/assets/images/am/filext/VSD.png');
                }else if(lowExt=="xmap"){
                    return require('@/assets/images/am/filext/XMAP.png');
                }else if(lowExt=="ys"){
                    return require('@/assets/images/am/filext/YS.png');
                }else if(lowExt=="ai"){
                    return require('@/assets/images/am/filext/AI.png');
                }else if(lowExt=="mp3"||lowExt=="mp4"||lowExt=="wmv"||lowExt=="rmvb"||lowExt=="mkv"||lowExt=="avi"){
                    return require('@/assets/images/am/filext/VIDEO.png');
                }else if(lowExt=="xls"||lowExt=="xlsx"){
                    return require('@/assets/images/am/filext/ELX.png');
                }else if(lowExt=="rar"||lowExt=="zip"){
                    return require('@/assets/images/am/filext/RAR.png');
                }else{
                    return require('@/assets/images/am/filext/FILE.png');
                }
            }
        },
        // 上传前校检格式和大小
        handleBeforeUpload(file) {
            // 校检文件大小
            if (this.fileSize) {
                const isLt = file.size / 1024 / 1024 < this.fileSize;
                if (!isLt) {
                    this.$modal.msgError(`上传文件大小不能超过 ${this.fileSize} MB!`);
                    return false;
                }
            }
            this.$modal.loading("正在上传文件，请稍候...");
            this.number++;
            return true;
        },
        // 上传失败
        handleUploadError(err) {
            this.$modal.msgError("上传图片失败，请重试");
            this.$modal.closeLoading()
        },
        // 上传成功回调
        handleUploadSuccess(res) {
            this.getList();
            this.$modal.closeLoading();
        },
        // 获取文件名称
        getFileName(name) {
            if (name.lastIndexOf("/") > -1) {
                return name.slice(name.lastIndexOf("/") + 1);
            } else {
                return "";
            }
        },
        // 获取扩展名
        getFileExt(name){
            let n = this.getFileName(name);
            let ar = n.split(".");
            return ar[ar.length-1];
        },
        // 对象转成指定字符串分隔
        listToString(list, separator) {
            let strs = "";
            separator = separator || ",";
            for (let i in list) {
                strs += list[i].url + separator;
            }
            return strs != '' ? strs.substr(0, strs.length - 1) : '';
        }
    }
};
</script>
