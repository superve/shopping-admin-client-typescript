import * as storage from "store";
import store from "../store/index";
import { STORAGE_TOKEN_KEY, STORAGE_USER_INFO } from "./config"

/**
 * 从store或本地存储获取token
 */
export function getToken(): string {
    const { user } = store.state;
    let accessToken = user.token ? 
        user.token 
        : 
        storage.get(STORAGE_TOKEN_KEY);
    return accessToken;
}

/**
 * 获取用户信息，在生成路由时候需要使用
 */
export function getUserInfo(): Record<string, any> {
    const { user } = store.state;
    let userInfo = storage.get(STORAGE_USER_INFO);

    if(!userInfo) {
        userInfo = user.user;
    }
    return userInfo;
}

/**
 * 登录后信息保存
 */
export function setUserAndToken(token: string, userInfo: object) {
    storage.set(STORAGE_TOKEN_KEY, token);
    storage.set(STORAGE_USER_INFO, userInfo);
}

/**
 * 删除本地数据，用于退出
 */
export function removeStorage(){
    storage.clearAll();
}