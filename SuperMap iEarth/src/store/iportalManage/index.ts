import { defineStore } from 'pinia'
import { userInfoType, IportalStoreStateType } from './index.d'

export const IportalStoreCreate = defineStore({
    id: "IportalStoreState",
    state: (): IportalStoreStateType => {
        return {
            isPortal: true,
            // 存储相关信息的
            portalUserprofile: undefined,
            portalConfig: undefined,
            systemConfig: undefined,
            userInfo: <userInfoType>{
                userName: "GUEST", // 用户名
                nickName: "", // 用户的昵称
                type: "", // 用户的类型，包括创建者 "CREATOR" 和查看者 "VIEWER" 两类。
                theme: "", // 用户设置的偏好主题。默认使用管理员配置好的默认主题。
                roles: "", // 用户分配的角色。
                modulePermissions: [], // 用户所拥有的权限。
                editablewebApps: [] // 用户具有使用权限的 WebApps。
            },
            isLogin: false, // 是否登录
            isSuperAdmin: false, // 是否是超级管理员,
            saveInfo: {}, // 保存场景时的相关信息
            SceneName:'', // 保存场景时自定义名称
        };
    },
    getters: {
        getUserInfo(): Object {
            return this.userInfo;
        }
    },
    actions: {
        setUserInfo(userinfoParam: userInfoType) {
            if (userinfoParam.nickName === "GUEST") {
                userinfoParam.userName = "游客";
            }
            this.userInfo = userinfoParam;
        }
    }
})