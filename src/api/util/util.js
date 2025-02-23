/****
 * 前面补零根据位数
 * @param num  被操作树
 * @param n    固定总位数
 * @returns {string}
 */
export function prefixZero(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

/****
 * 构建单据编号
 * @param serial
 * @param addCount
 * @returns {string}
 */
export function buildBarCode(serial,addCount){
    return serial.prefix + prefixZero(serial.serialNum+addCount,parseInt(serial.codeLength));
}

/****
 * 数字，转大写金额
 * @param amount
 * @returns {string}
 */
export function toChNumStr(amount) {
    //形参
    // 汉字的数字
    const cnNums = [
        "零",
        "壹",
        "贰",
        "叁",
        "肆",
        "伍",
        "陆",
        "柒",
        "捌",
        "玖",
    ];
    // 基本单位
    const cnIntRadice = ["", "拾", "佰", "仟"];
    // 对应整数部分扩展单位
    const cnIntUnits = ["", "万", "亿", "兆"];
    // 对应小数部分单位
    const cnDecUnits = ["角", "分"];
    // 整数金额时后面跟的字符
    const cnInteger = "整";
    // 整型完以后的单位
    const cnIntLast = "元";
    // 最大处理的数字
    const maxNum = 9999999999999999.99;
    // 金额整数部分
    let integerNum;
    // 金额小数部分
    let decimalNum;
    // 输出的中文金额字符串
    let chineseStr = "";
    // 分离金额后用的数组，预定义
    let parts;
    if (amount === "") {
        return "";
    }
    amount = parseFloat(amount);
    if (amount >= maxNum) {
        // 超出最大处理数字
        return "";
    }
    if (amount === 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    // 转换为字符串
    amount = amount.toString();
    if (amount.indexOf(".") === -1) {
        integerNum = amount;

        decimalNum = "";
    } else {
        parts = amount.split(".");
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    // 获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        let zeroCount = 0;
        const IntLen = integerNum.length;
        for (let i = 0; i < IntLen; i++) {
            const n = integerNum.substr(i, 1);
            const p = IntLen - i - 1;
            const q = p / 4;
            const m = p % 4;
            if (n === "0") {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                // 归零
                zeroCount = 0;
                //alert(cnNums[parseInt(n)])
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m === 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    // 小数部分
    if (decimalNum !== "") {
        const decLen = decimalNum.length;
        for (let i = 0; i < decLen; i++) {
            const n = decimalNum.substr(i, 1);
            if (n !== "0") {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr === "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum === "") {
        chineseStr += cnInteger;
    }
    return chineseStr;//转好的大写文字
}

export function toEsStr(amt,emptyToZero){
    if(amt){
        if(typeof amt == 'number'){
            return amt.toLocaleString('en-US');
        }else{
            return Number(amt).toLocaleString('en-US');
        }
    }else{
        if(emptyToZero){
            return "0";
        }else{
            return "";
        }
    }
}
/*****
 * 主要用在表格里的缩略内容，太长了，展示省略号
 * @param str   需要处理的字符
 * @param len   处理到的长度
 * @returns {string|*}
 */
export function longStrEllipsis(str,len){
    console.log(str)
    if(str){
        if(str.length>len){
            return str.substring(0,len)+"...";
        }else{
            return str;
        }
    }else{
        return "";
    }
}

/*****
 * 判断是否为空
 * @param value
 * @returns {boolean}
 */
export function isEmpty(value){
    if(value=='' || value == undefined){
        return true;
    }else{
        return false;
    }

}


/****
 * 根据日期获取星期几
 * @param time
 * @returns {*|string}
 */
export function getWeekDay (time) {
    const weekNum = new Date(time).getDay();
    const week = {
        0: '星期天',
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六'
    }
    return week[weekNum] ? week[weekNum] : '日期错误';
}

/****
 * 根据日期获取本年度，第几周
 * @param endDate
 * @returns {number}
 */
export function getYearWeek(time) {
    let endDate = new Date(time);
    //本年的第一天
    var beginDate = new Date(endDate.getFullYear(), 0, 1);
    //星期从0-6,0代表星期天，6代表星期六
    var endWeek = endDate.getDay();
    if (endWeek == 0) endWeek = 7;
    var beginWeek = beginDate.getDay();
    if (beginWeek == 0) beginWeek = 7;
    //计算两个日期的天数差
    var millisDiff = endDate.getTime() - beginDate.getTime();
    var dayDiff = Math.floor(( millisDiff + (beginWeek - endWeek) * (24 * 60 * 60 * 1000)) / 86400000);
    return Math.ceil(dayDiff / 7) + 1;
}


/*****
 * 根据值，格式化，数据，返回名称
 * @param list
 * @param value
 * @param key
 * @param label
 */
export function formatLabelByValue(list,value,key,label){
    let name = "";
    if(list && list.length>0){
        list.forEach(item=>{
            if(item[key] == value){
                name = item[label];
            }
        })
    }
    return name;
}

/*****
 * 文件大小转中文
 * @param size
 * @returns {string}
 */
export function fileSizeToCH(size) {
    if (size < 0.1 * 1024) {
        //小于0.1KB，则转化成B
        size = size.toFixed(2) + "B";
    } else if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + "KB";
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
        // 小于0.1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + "MB";
    } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    // 转成字符串
    let sizeStr = size + "",
        // 获取小数点处的索引
        index = sizeStr.indexOf("."),
        // 获取小数点后两位的值
        dou = sizeStr.substr(index + 1, 2);

    // 判断后两位是否为00，如果是则删除00
    if (dou == "00") return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);

    return size;
}
