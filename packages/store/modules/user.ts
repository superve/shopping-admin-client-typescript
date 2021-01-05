import { Module } from "vuex"

import userApi from "../../api/user";
import { addPermission } from "../../permission/permission"
import { Permissions } from "../../permission/config"
import { UserState } from "../types/stateTypes";
import { UserParams } from "../../api/types/userTypes";
import { setUserAndToken } from "../../utils/storage";

// jest测试时不认识该语法
// const { login, adminLogin } = userApi;
// const { getAllUser } = userApi;

const user: Module<UserState, any> = {
    namespaced: true,
    state: {
        token: "",
        user: {
            // 默认权限
            permission: Permissions.PUBLIC 
        },
        allUsers: []
    },

    mutations: {
        SET_TOKEN (state, token) {
            state.token = token;
        },
        SET_USER (state, user) {
            state.user = user;
        },
        CLEAR_TOKEN_USER (state) {
            state.token = "";
            state.user = {
                permission: Permissions.PUBLIC 
            };
        }
    },

    actions: {
        // 管理员登录
        adminLogin ({ commit }, data: UserParams.AdminLogin) {
            return new Promise((resolve, reject) => {
                userApi.adminLogin(data)
                    .then(res => {
                        const { token, user } = res.data;
                        // 给用户添加权限
                        user.permission = addPermission(user.role || user.roles);
                        commit("SET_TOKEN", "Bearer " + token);
                        commit("SET_USER", user);
                        setUserAndToken("Bearer " + token, user);
                        resolve(res);
                    }).catch(error => {
                        reject(error);
                    })
            })
        },

        // 获取所有用户
        getUsers({ commit }, data: UserParams.GetUsers) {
            return new Promise((resolve, reject) => {
                userApi.getUsers(data)
                    .then(res => {
                        resolve(res);
                    }).catch(error => {
                        reject(error)
                    })
            })
        },

        // 获取所有用户数量
        getUsersCount({ commit }, data: UserParams.GetUsers) {
            return new Promise((resolve, reject) => {
                userApi.getUsersCount(data)
                    .then(res => {
                        resolve(res);
                    }).catch(error => {
                        reject(error)
                    })
            })
        },

        // 获取所有管理员用户
        getAdmin({ commit }, data: UserParams.GetAdmin) {
            return new Promise((resolve, reject) => {
                userApi.getAdmin(data)
                    .then(res => {
                        resolve(res);
                    }).catch(error => {
                        reject(error)
                    })
            })
        },

        // 创建管理员
        createAdmin({ commit }, data: UserParams.CreateAdmin) {
            return new Promise((resolve, reject) => {
                userApi.createAdmin(data)
                    .then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    })
            })
        }
    }
}

export default user;