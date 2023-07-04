// 用户信息
type userInfoType = {
    userName: string, // 用户名
    nickName: string, // 用户的昵称
    type: string, // 用户的类型，包括创建者 "CREATOR" 和查看者 "VIEWER" 两类。
    theme: string, // 用户设置的偏好主题。默认使用管理员配置好的默认主题。
    roles: string, // 用户分配的角色。
    modulePermissions: Array<string>, // 用户所拥有的权限。
    editablewebApps: Array<string> // 用户具有使用权限的 WebApps。
}

// iportal Type
interface IportalStoreStateType {
    isPortal: boolean, // 是否为iportal环境
    portalUserprofile: any,
    portalConfig: any,
    systemConfig: any,

    isLogin:boolean, // 是否登录
    isSuperAdmin:boolean, // 是否为超级管理员
    
    userInfo: userInfoType,

    isCreateScene:boolean, // 是否为创建场景 || 编辑场景
    saveInfo:any,
}

export {
    userInfoType,
    IportalStoreStateType
}