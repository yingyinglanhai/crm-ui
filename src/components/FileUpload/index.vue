<template>
    <div class="upload-file">
        <el-upload
            multiple
            :action="uploadFileUrl"
            :before-upload="handleBeforeUpload"
            :file-list="fileList"
            :limit="limit"
            :on-error="handleUploadError"
            :on-exceed="handleExceed"
            :on-success="handleUploadSuccess"
            :show-file-list="false"
            :headers="headers"
            class="upload-file-uploader"
            ref="upload"
            :disabled="disabled"
            v-if="!disabled"
        >
            <!-- 上传按钮 -->
            <el-button size="mini" type="primary">选取文件</el-button>
            <!-- 上传提示 -->
            <div class="el-upload__tip" slot="tip" v-if="showTip">
                请上传
                <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></template>
                <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b></template>
                的文件
            </div>
        </el-upload>

        <!-- 文件列表 -->
        <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
            <li :key="file.url" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
                <div class="fileAndDel">
                    <el-link :href="`${baseUrl}${file.url}`" :underline="false" target="_blank">
                        <el-image style="width: 100px; height: 100px" :src="getFileImage(file.name)" fit="fill"></el-image>
                    </el-link>
                    <div class="ele-upload-list__item-content-action" v-if="!disabled">
                        <el-link :underline="false" @click="handleDelete(index)" type="danger" style="width: 50px;">
                            删除
                        </el-link>
                    </div>
                </div>
                <div class="el-icon-document elipsis"> {{ getFileName(file.name) }}</div>


            </li>
        </transition-group>
    </div>
</template>

<script>
import {getToken} from "@/utils/auth";

export default {
    name: "FileUpload",
    props: {
        // 值
        value: [String, Object, Array],
        // 数量限制
        limit: {
            type: Number,
            default: 5,
        },
        // 大小限制(MB)
        fileSize: {
            type: Number,
            default: 5,
        },
        // 文件类型, 例如['png', 'jpg', 'jpeg']
        fileType: {
            type: Array,
            default: () => ["doc", "docx", "xls", "xlsx", "ppt", "txt", "pdf", "mp3", "mp4", "wmv", "rmvb", "mkv"],
        },
        // 是否显示提示
        isShowTip: {
            type: Boolean,
            default: true
        },
        // 是否禁用
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            number: 0,
            uploadList: [],
            baseUrl: process.env.VUE_APP_BASE_API,
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 通用上传文件
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            fileList: [],
        };
    },
    watch: {
        value: {
            handler(val) {
                if (val) {
                    let temp = 1;
                    // 首先将值转为数组
                    const list = Array.isArray(val) ? val : this.value.split(',');
                    // 然后将数组转为对象数组
                    this.fileList = list.map(item => {
                        if (typeof item === "string") {
                            item = {name: item, url: item};
                        }
                        item.uid = item.uid || new Date().getTime() + temp++;
                        return item;
                    });
                } else {
                    this.fileList = [];
                    return [];
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        // 是否显示提示
        showTip() {
            return this.isShowTip && (this.fileType || this.fileSize);
        },
    },
    methods: {
        //  获取文件缩略图
        getFileImage(name) {
            let ext = this.getFileExt(name);
            console.log("文件扩展名为：" + ext);
            if (ext) {
                let lowExt = ext.toLowerCase();
                if (lowExt == "doc" || lowExt == "docx") {
                    return require('@/assets/images/am/filext/DOC.png');
                } else if (lowExt == "pdf") {
                    return require('@/assets/images/am/filext/PDF.png');
                } else if (lowExt == "ppt") {
                    return require('@/assets/images/am/filext/PPT.png');
                } else if (lowExt == "psd") {
                    return require('@/assets/images/am/filext/PSD.png');
                } else if (lowExt == "txt") {
                    return require('@/assets/images/am/filext/TXT.png');
                } else if (lowExt == "vsd") {
                    return require('@/assets/images/am/filext/VSD.png');
                } else if (lowExt == "xmap") {
                    return require('@/assets/images/am/filext/XMAP.png');
                } else if (lowExt == "ys") {
                    return require('@/assets/images/am/filext/YS.png');
                } else if (lowExt == "ai") {
                    return require('@/assets/images/am/filext/AI.png');
                } else if (lowExt == "mp3" || lowExt == "mp4" || lowExt == "wmv" || lowExt == "rmvb" || lowExt == "mkv" || lowExt == "avi") {
                    return require('@/assets/images/am/filext/VIDEO.png');
                } else if (lowExt == "xls" || lowExt == "xlsx") {
                    return require('@/assets/images/am/filext/ELX.png');
                } else if (lowExt == "rar" || lowExt == "zip") {
                    return require('@/assets/images/am/filext/RAR.png');
                } else {
                    return require('@/assets/images/am/filext/FILE.png');
                }
            }
        },
        // 上传前校检格式和大小
        handleBeforeUpload(file) {
            // 校检文件类型
            if (this.fileType) {
                let fileExtension = "";
                if (file.name.lastIndexOf(".") > -1) {
                    fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
                }
                const isTypeOk = this.fileType.some((type) => {
                    if (file.type.indexOf(type) > -1) return true;
                    // docx上传会被doc校验控制住
                    // if (fileExtension && fileExtension.indexOf(type) > -1) return true;
                    if (fileExtension && fileExtension == type) return true;
                    return false;
                });
                if (!isTypeOk) {
                    this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
                    return false;
                }
            }
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
        // 文件个数超出
        handleExceed() {
            this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
        },
        // 上传失败
        handleUploadError(err) {
            this.$modal.msgError("上传图片失败，请重试");
            this.$modal.closeLoading()
        },
        // 上传成功回调
        handleUploadSuccess(res) {
            this.uploadList.push({name: res.fileName, url: res.fileName});
            if (this.uploadList.length === this.number) {
                this.fileList = this.fileList.concat(this.uploadList);
                this.uploadList = [];
                this.number = 0;
                this.$emit("input", this.listToString(this.fileList));
                this.$modal.closeLoading();
            }
        },
        // 删除文件
        handleDelete(index) {
            this.fileList.splice(index, 1);
            this.$emit("input", this.listToString(this.fileList));
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
        getFileExt(name) {
            let n = this.getFileName(name);
            let ar = n.split(".");
            return ar[ar.length - 1];
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

<style scoped lang="scss">
.upload-file-uploader {
    margin-bottom: 5px;
}

.upload-file-list {
    display: flex;
}

.el-icon-document {
    width: 100%;
    padding: 5px 10px;
}


.upload-file-list .el-upload-list__item {
    border: 1px solid #e4e7ed;
    line-height: 2;
    margin-bottom: 10px;
    margin-right: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .fileAndDel{
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
}

.upload-file-list .ele-upload-list__item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
}

.ele-upload-list__item-content-action .el-link {
    margin-right: 10px;
}


.el-upload-list__item:first-child{
    margin-top: 5px;
}

</style>
