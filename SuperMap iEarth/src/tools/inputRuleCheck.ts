/**
 * 图层名称
 * token
 * URL地址：包括S3M、IMG、地形、场景等待
 * 上传数据：本地数据、飞行路径、视频投放
 * 下载数据：保存飞行路径
 * Input输入数字
 * 保存面板：时间、文字input（标签用户名等待）
 */

// 云研发提供的统一校验框
import { validate } from '@ispeco/validators';

// 校验类型
export enum RuleCheckTypeEnum {
    URL = 'URL',
    Number = 'Number',
    Text = 'Text',
    Token = 'Token',
    SceneUrl = 'SceneUrl'
}

// 校验失败提示信息
const ErrorCode = {
    INVALID_INPUT:  $t ? $t('INVALID_INPUT') :"输入内容不合法",
    INVALID_URL: $t ? $t('INVALID_URL') :"输入的URL无法访问",
    INVALID_FORMAT: $t ? $t('INVALID_FORMAT') :"输入的URL格式不正确",
    OUT_OF_RANGE: $t ? $t('OUT_OF_RANGE') :"不在范围内",
    NO_LINE_BREAKS_OR_CARRIAGE_RETURNS: $t ? $t('NO_LINE_BREAKS_OR_CARRIAGE_RETURNS') :"不允许输入换行符和回车符",
    FIELD_REQUIRED: $t ? $t('FIELD_REQUIRED') :"该字段不能为空",
    NUMERIC_ONLY: $t ? $t('NUMERIC_ONLY') :"该字段仅能输入数字",
    TEXT_ONLY: $t ? $t('NUMERIC_ONLY') :"该字段仅能输入文字", // 非标准
    EXCEED_MAX_VALUE_ALLOWED: $t ? $t('EXCEED_MAX_VALUE_ALLOWED') :"不能超过最大值",
    BELOW_MIN_VALUE_ALLOWED: $t ? $t('BELOW_MIN_VALUE_ALLOWED') :"不能小于最小值",
}

// 检验输入框内容是否合法
export const inputRuleCheck = (value: String|Number, type: RuleCheckTypeEnum, option?: any):any => {
    switch (type) {
        case RuleCheckTypeEnum.URL: 
            return handleUrl(value); // break;
        case RuleCheckTypeEnum.Text:
            return handleText(value);
        case RuleCheckTypeEnum.Number:
            return handleNumber(value);
        case RuleCheckTypeEnum.Token:
            return handleToken(value);
        default:
            return false;
    }
}

// 校验URL
// TODO:验证URL是否可正常访问、非法网站（木马、黄赌毒网站）跳转的防护
function handleUrl(url, option?: any){
    if(isNull(url)) return {isPass:false, message:ErrorCode.FIELD_REQUIRED};
    if(isCRLF(url)) return {isPass:false, message:ErrorCode.NO_LINE_BREAKS_OR_CARRIAGE_RETURNS};
    // if(!isURL(url)) return {isPass:false, message:ErrorCode.INVALID_FORMAT};
    const response = isURL(url);
    if(response && response.error) return {isPass:false, message:ErrorCode[response.error]};
    return {isPass:true, message:'checked'};
}

// 校验文字
function handleText(str, option?: any){
    if(isNull(str)) return {isPass:false, message:ErrorCode.FIELD_REQUIRED};
    if(isCRLF(str)) return {isPass:false, message:ErrorCode.NO_LINE_BREAKS_OR_CARRIAGE_RETURNS};
    const response = isText(str);
    if(response && response.error) return {isPass:false, message:ErrorCode[response.error]};
    return {isPass:true, message:'checked'};
}

// 处理token
function handleToken(token, option?: any){
    if(isNull(token)) return {isPass:false, message:ErrorCode.FIELD_REQUIRED};
    if(isCRLF(token)) return {isPass:false, message:ErrorCode.NO_LINE_BREAKS_OR_CARRIAGE_RETURNS};
    return {isPass:true, message:'checked'};
}

// 处理Number
function handleNumber(number, option?: any){
    if(isNull(number)) return {isPass:false, message:ErrorCode.FIELD_REQUIRED};
    if(isCRLF(number)) return {isPass:false, message:ErrorCode.NO_LINE_BREAKS_OR_CARRIAGE_RETURNS};
    const response = isNumber(number);
    if(response && response.error) return {isPass:false, message:ErrorCode[response.error]};
    return {isPass:true, message:'checked'};
}

// TODO: 处理上传文件
function handleUpload(file, option?: any){
    if(file === '') return '不能为空';
}
// TODO: 处理下载文件
function handleDownload(file, option?: any){
    if(file === '') return '不能为空';
}

// 判断是否为空
function isNull(value){
    if(value === '' || value == null || value == undefined){
        return true;
    }else{
        return false;
    }
}

// 判断是否是CRLF:回车和换行符
const reg_crlf = /[\r\n]/g; 
function isCRLF(value){
    return reg_crlf.test(value) ? true : false;
}

// 判断是否为文字
const rule_text = { rules: [{ type: 'text', required: true, len: 1000 }]};
function isText(value){
    const response = validate(value, rule_text);
    return response ? response : false; // 返回null时表示通过校验
}

// 判断是否为数字
// const reg_number = /^[0-9]+\.?[0-9]*$/; // 含小数
const rule_number = { rules: [{ type: 'number', required: true }]};
function isNumber(value){
    // return reg_number.test(value) ? true : false; // 使用正则的方式
    value = Math.abs(value);
    const response = validate(value, rule_number);
    return response ? response : false; // 返回null时表示通过校验
}

// 判断是否为URL
// const reg_url = /^(https?:\/\/)?([a-zA-Z0-9.-]+(\:[0-9]+)?)+((\/[^\s]*)?)$/;
// const reg_url = /^(http|https):\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/;
const rule_url = { rules: [{ type: 'url', required: true, len: 8182, option:{validate_length:true} }]}; // 最大长度设置为8182，validate_length不起作用
function isURL(value){
    const response = validate(value, rule_url);
    return response ? response : false; // 返回null时表示通过校验
}