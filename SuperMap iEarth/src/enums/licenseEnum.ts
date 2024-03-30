/**
 * @description: 许可返回值
 */
export enum  licenseEnum {
    TIMEOUT = -2,  //过期
    NULL = -1,  //没有许可
    TRIAL = 0, //试用许可
    FORMAL = 1, //正式许可
    DEV = 2, // 开发
    EDUCATION = 3, //教育许可
    INDIVI = 4, //个人 
    STAFF = 5, //员工 
    
  }