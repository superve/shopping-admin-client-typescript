import generatorService from "../utils/generatorService";
import { ApiRequestConfig as Api, ApiConfig } from "../utils/http/types"
import { UserParams } from "./types/userTypes";

// 不想写data就使用Partial转成可选的
const login: Api<UserParams.Login> = {
    url: "/accounts/login",
    method: "POST"
}

const register: Api<UserParams.Register> = {
    url: "/accounts/register",
    method: "POST"
}

const adminLogin: Api<UserParams.AdminLogin> = {
    url: "/admin/login",
    method: "POST",
}

const getUsers: Api<UserParams.GetUsers> = {
    url: "/users",
    method: "GET",
    token: true
}

// 获取用户总数
const getUsersCount: Api<UserParams.GetUsers> = {
    url: "/users/count",
    method: "GET",
    token: true
}

const getAdminUserMe: Api<{}> = {
    url: "/admin/login",
    method: "GET",
    token: true
}

// 获取所有管理员用户
const getAdmin: Api<UserParams.GetAdmin> = {
    url: "/admin/users",
    method: "GET",
    token: true
}

// 新增管理员
const createAdmin: Api<UserParams.CreateAdmin> = {
    url: "/admin/users",
    method: "POST",
    token: true
}

// 根据id获取管理员信息
const getAdminById: Api<{}> = {
    url: "/admin/users/:id",
    method: "GET",
    token: true
}

const editeAdmin: Api<UserParams.CreateAdmin> = {
    url: "/admin/users/:id",
    method: "PUT",
    token: true
}

export default generatorService({
    login,
    register,
    adminLogin,
    getUsers,
    getUsersCount,
    getAdminUserMe,
    getAdmin,
    createAdmin,
    getAdminById,
    editeAdmin
});