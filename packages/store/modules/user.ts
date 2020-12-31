import { Module } from "vuex"

import userApi from "../../api/user";
import { addPermission } from "../../permission/permission"
import { Permissions } from "../../permission/config"
import { StoreTypes, UserApiParams } from "../../types/userTypes";
import { setUserAndToken } from "../../utils/storage";

// jest测试时不认识该语法
// const { login, adminLogin } = userApi;
// const { getAllUser } = userApi;

const user: Module<StoreTypes.State, any> = {
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
        adminLogin ({ commit }, data: UserApiParams.AdminLogin) {
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
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
        },

        // 获取所有用户列表
        getAllUsers({ commit }, data: UserApiParams.GetAllUsers) {
            return new Promise((resolve, reject) => {
                userApi.getAllUser(data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        }
    }
}

export default user;